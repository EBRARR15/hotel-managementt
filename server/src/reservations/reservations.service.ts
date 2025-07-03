import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';
import { Reservation, ReservationStatus, ReservationWithDetails } from './interfaces/reservation.interface';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private databaseService: DatabaseService) {}

  private get reservationsCollection(): Collection<Reservation> {
    return this.databaseService.getCollection<Reservation>('reservations');
  }

  private get roomsCollection(): Collection<any> {
    return this.databaseService.getCollection<any>('rooms');
  }

  private get usersCollection(): Collection<any> {
    return this.databaseService.getCollection<any>('users');
  }

  // Rezervasyon oluştur
  async create(createReservationDto: CreateReservationDto, customerId: string): Promise<Reservation> {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, ...reservationData } = createReservationDto;

    // Tarih validasyonu
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new BadRequestException('Check-in tarihi bugünden önce olamaz');
    }

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out tarihi check-in tarihinden sonra olmalıdır');
    }

    // Oda kontrolü
    if (!ObjectId.isValid(roomId)) {
      throw new BadRequestException('Geçersiz oda ID formatı');
    }

    const room = await this.roomsCollection.findOne({ _id: new ObjectId(roomId) });
    if (!room) {
      throw new NotFoundException('Oda bulunamadı');
    }

    if (!room.isActive || room.status !== 'available') {
      throw new ConflictException('Bu oda şu anda müsait değil');
    }

    if (numberOfGuests > room.capacity) {
      throw new BadRequestException(`Bu oda en fazla ${room.capacity} kişi kapasiteli`);
    }

    // Tarih çakışması kontrolü
    const conflictingReservation = await this.checkDateConflict(roomId, checkIn, checkOut);
    if (conflictingReservation) {
      throw new ConflictException('Bu tarihler arasında oda zaten rezerve edilmiş');
    }

    // Toplam fiyat hesaplama
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.price;

    const newReservation: Omit<Reservation, '_id'> = {
      roomId: new ObjectId(roomId),
      customerId: new ObjectId(customerId),
      guestName: reservationData.guestName,
      guestEmail: reservationData.guestEmail,
      guestPhone: reservationData.guestPhone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      totalPrice,
      status: ReservationStatus.CONFIRMED,
      notes: reservationData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.reservationsCollection.insertOne(newReservation as Reservation);
    
    // Oda status'ını artık güncellemiyoruz - sadece tarih bazlı kontrol yeterli

    return { ...newReservation, _id: result.insertedId } as Reservation;
  }

  // Tarih çakışması kontrolü
  private async checkDateConflict(roomId: string, checkIn: Date, checkOut: Date, excludeReservationId?: string): Promise<boolean> {
    const query: any = {
      roomId: new ObjectId(roomId),
      status: { $in: [ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn }
        }
      ]
    };

    if (excludeReservationId) {
      query._id = { $ne: new ObjectId(excludeReservationId) };
    }

    const conflictingReservation = await this.reservationsCollection.findOne(query);
    return !!conflictingReservation;
  }

  // Tüm rezervasyonları getir
  async findAll(filters?: {
    status?: ReservationStatus;
    roomId?: string;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<ReservationWithDetails[]> {
    const query: any = {};

    if (filters) {
      if (filters.status) query.status = filters.status;
      if (filters.roomId) query.roomId = new ObjectId(filters.roomId);
      if (filters.customerId) query.customerId = new ObjectId(filters.customerId);
      if (filters.startDate || filters.endDate) {
        query.checkInDate = {};
        if (filters.startDate) query.checkInDate.$gte = filters.startDate;
        if (filters.endDate) query.checkInDate.$lte = filters.endDate;
      }
    }

    const reservations = await this.reservationsCollection.find(query).sort({ checkInDate: -1 }).toArray();

    // Oda ve müşteri bilgilerini ekle
    const reservationsWithDetails: ReservationWithDetails[] = [];
    for (const reservation of reservations) {
      const room = await this.roomsCollection.findOne({ _id: reservation.roomId });
      const customer = await this.usersCollection.findOne({ _id: reservation.customerId });

      reservationsWithDetails.push({
        ...reservation,
        room: room ? {
          roomNumber: room.roomNumber,
          type: room.type,
          floor: room.floor,
        } : undefined,
        customer: customer ? {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        } : undefined,
      });
    }

    return reservationsWithDetails;
  }

  // Tek rezervasyon getir
  async findOne(id: string): Promise<ReservationWithDetails> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Geçersiz rezervasyon ID formatı');
    }

    const reservation = await this.reservationsCollection.findOne({ _id: new ObjectId(id) });
    if (!reservation) {
      throw new NotFoundException('Rezervasyon bulunamadı');
    }

    const room = await this.roomsCollection.findOne({ _id: reservation.roomId });
    const customer = await this.usersCollection.findOne({ _id: reservation.customerId });

    return {
      ...reservation,
      room: room ? {
        roomNumber: room.roomNumber,
        type: room.type,
        floor: room.floor,
      } : undefined,
      customer: customer ? {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      } : undefined,
    };
  }

  // Rezervasyon güncelle
  async update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Geçersiz rezervasyon ID formatı');
    }

    const existingReservation = await this.reservationsCollection.findOne({ _id: new ObjectId(id) });
    if (!existingReservation) {
      throw new NotFoundException('Rezervasyon bulunamadı');
    }

    const updateData: any = {
      ...updateReservationDto,
      updatedAt: new Date(),
    };

    // Tarih güncellemeleri varsa validasyon yap
    if (updateReservationDto.checkInDate || updateReservationDto.checkOutDate) {
      const checkIn = updateReservationDto.checkInDate 
        ? new Date(updateReservationDto.checkInDate) 
        : existingReservation.checkInDate;
      const checkOut = updateReservationDto.checkOutDate 
        ? new Date(updateReservationDto.checkOutDate) 
        : existingReservation.checkOutDate;

      if (checkOut <= checkIn) {
        throw new BadRequestException('Check-out tarihi check-in tarihinden sonra olmalıdır');
      }

      updateData.checkInDate = checkIn;
      updateData.checkOutDate = checkOut;

      // Fiyat yeniden hesaplama
      const room = await this.roomsCollection.findOne({ _id: existingReservation.roomId });
      if (room) {
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        updateData.totalPrice = nights * room.price;
      }
    }

    const result = await this.reservationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Rezervasyon güncellenemedi');
    }

    // Artık oda status'ını güncellemiyoruz

    return await this.reservationsCollection.findOne({ _id: new ObjectId(id) }) as Reservation;
  }

  // Rezervasyon sil
  async remove(id: string): Promise<{ message: string }> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Geçersiz rezervasyon ID formatı');
    }

    const reservation = await this.reservationsCollection.findOne({ _id: new ObjectId(id) });
    if (!reservation) {
      throw new NotFoundException('Rezervasyon bulunamadı');
    }

    const result = await this.reservationsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Rezervasyon silinemedi');
    }

    // Artık oda status'ını güncellemiyoruz

    return { message: 'Rezervasyon başarıyla silindi' };
  }

  // Rezervasyon durumuna göre oda durumunu güncelle
  private async updateRoomStatusBasedOnReservation(roomId: string, newStatus?: ReservationStatus): Promise<void> {
    const now = new Date();
    
    // Bu oda için aktif rezervasyonları kontrol et
    const activeReservations = await this.reservationsCollection.find({
      roomId: new ObjectId(roomId),
      status: { $in: [ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN] },
      checkInDate: { $lte: now },
      checkOutDate: { $gt: now }
    }).toArray();

    let roomStatus = 'available';
    
    if (activeReservations.length > 0) {
      // Aktif rezervasyon varsa oda dolu
      roomStatus = 'occupied';
    } else {
      // Gelecekteki rezervasyonları kontrol et
      const futureReservations = await this.reservationsCollection.find({
        roomId: new ObjectId(roomId),
        status: { $in: [ReservationStatus.CONFIRMED] },
        checkInDate: { $gt: now }
      }).toArray();

      if (futureReservations.length > 0) {
        roomStatus = 'available'; // Gelecekte rezervasyon var ama şu an müsait
      }
    }

    await this.roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { $set: { status: roomStatus, updatedAt: new Date() } }
    );
  }

  // Tüm odaların durumlarını rezervasyonlara göre güncelle (Maintenance metodu)
  async updateAllRoomStatuses(): Promise<void> {
    const rooms = await this.roomsCollection.find({ isActive: true }).toArray();
    
    for (const room of rooms) {
      await this.updateRoomStatusBasedOnReservation(room._id.toString());
    }
  }

  // Müşterinin rezervasyonları
  async findByCustomer(customerId: string): Promise<ReservationWithDetails[]> {
    if (!ObjectId.isValid(customerId)) {
      throw new BadRequestException('Geçersiz müşteri ID formatı');
    }

    return this.findAll({ customerId });
  }

  // Oda müsaitlik kontrolü
  async checkRoomAvailability(roomId: string, checkInDate: string, checkOutDate: string): Promise<{ available: boolean; conflictingReservations?: any[] }> {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const conflictingReservations = await this.reservationsCollection.find({
      roomId: new ObjectId(roomId),
      status: { $in: [ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn }
        }
      ]
    }).toArray();

    return {
      available: conflictingReservations.length === 0,
      conflictingReservations: conflictingReservations.length > 0 ? conflictingReservations : undefined
    };
  }

  // Günlük rezervasyon istatistikleri
  async getDailyStats(date?: Date): Promise<any> {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const stats = await this.reservationsCollection.aggregate([
      {
        $match: {
          $or: [
            { checkInDate: { $gte: startOfDay, $lte: endOfDay } },
            { checkOutDate: { $gte: startOfDay, $lte: endOfDay } },
            {
              checkInDate: { $lte: startOfDay },
              checkOutDate: { $gte: endOfDay }
            }
          ]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]).toArray();

    return stats;
  }
} 