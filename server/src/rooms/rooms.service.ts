import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';
import { Room, RoomType, RoomStatus, ROOM_PRICING } from './interfaces/room.interface';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private databaseService: DatabaseService) {}

  private get roomsCollection(): Collection<Room> {
    return this.databaseService.getCollection<Room>('rooms');
  }

  private get reservationsCollection(): Collection<any> {
    return this.databaseService.getCollection<any>('reservations');
  }

  // Yeni oda oluştur
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    // Oda numarası benzersiz olmalı
    const existingRoom = await this.roomsCollection.findOne({ 
      roomNumber: createRoomDto.roomNumber 
    });
    
    if (existingRoom) {
      throw new ConflictException(`${createRoomDto.roomNumber} numaralı oda zaten mevcut`);
    }

    // Eğer amenities belirtilmemişse, room type'a göre default amenities'leri ekle
    const amenities = createRoomDto.amenities || ROOM_PRICING[createRoomDto.type].defaultAmenities;
    
    // Eğer fiyat belirtilmemişse, room type'a göre default fiyat
    const price = createRoomDto.price || ROOM_PRICING[createRoomDto.type].basePrice;

    const newRoom: Omit<Room, '_id'> = {
      ...createRoomDto,
      amenities,
      price,
      status: createRoomDto.status || RoomStatus.AVAILABLE,
      isActive: createRoomDto.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.roomsCollection.insertOne(newRoom as Room);
    return { ...newRoom, _id: result.insertedId } as Room;
  }

  // Tüm odaları listele
  async findAll(filters?: {
    type?: RoomType;
    status?: RoomStatus;
    floor?: number;
    capacity?: number;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
  }): Promise<Room[]> {
    const query: any = {};

    if (filters) {
      if (filters.type) query.type = filters.type;
      if (filters.status) query.status = filters.status;
      if (filters.floor !== undefined) query.floor = filters.floor;
      if (filters.capacity) query.capacity = { $gte: filters.capacity };
      if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = filters.minPrice;
        if (filters.maxPrice) query.price.$lte = filters.maxPrice;
      }
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
    }

    return await this.roomsCollection.find(query).sort({ floor: 1, roomNumber: 1 }).toArray();
  }

  // Belirli bir odayı getir
  async findOne(id: string): Promise<Room> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Geçersiz oda ID formatı');
    }

    const room = await this.roomsCollection.findOne({ _id: new ObjectId(id) });
    if (!room) {
      throw new NotFoundException('Oda bulunamadı');
    }

    return room;
  }

  // Oda numarasına göre oda getir
  async findByRoomNumber(roomNumber: string): Promise<Room> {
    const room = await this.roomsCollection.findOne({ roomNumber });
    if (!room) {
      throw new NotFoundException(`${roomNumber} numaralı oda bulunamadı`);
    }

    return room;
  }

  // Oda güncelle
  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Geçersiz oda ID formatı');
    }

    // Eğer oda numarası güncelleniyorsa, benzersizlik kontrolü yap
    if (updateRoomDto.roomNumber) {
      const existingRoom = await this.roomsCollection.findOne({ 
        roomNumber: updateRoomDto.roomNumber,
        _id: { $ne: new ObjectId(id) }
      });
      
      if (existingRoom) {
        throw new ConflictException(`${updateRoomDto.roomNumber} numaralı oda zaten mevcut`);
      }
    }

    const updateData = {
      ...updateRoomDto,
      updatedAt: new Date(),
    };

    const result = await this.roomsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new NotFoundException('Oda bulunamadı');
    }

    return result;
  }

  // Oda sil (hard delete)
  async remove(id: string): Promise<{ message: string }> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Geçersiz oda ID formatı');
    }

    // First get the room to return room number in message
    const room = await this.roomsCollection.findOne({ _id: new ObjectId(id) });
    if (!room) {
      throw new NotFoundException('Oda bulunamadı');
    }

    // Actually delete the room from database
    const result = await this.roomsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Oda silinemedi');
    }

    return { message: `${room.roomNumber} numaralı oda tamamen silindi` };
  }

  // Oda durumunu değiştir
  async updateStatus(id: string, status: RoomStatus): Promise<Room> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Geçersiz oda ID formatı');
    }

    const result = await this.roomsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new NotFoundException('Oda bulunamadı');
    }

    return result;
  }

  // Müsait odaları getir (gerçek zamanlı kontrol)
  async getAvailableRooms(minCapacity?: number, checkInDate?: string, checkOutDate?: string): Promise<Room[]> {
    const query: any = { 
      isActive: true
      // Status kontrolü kaldırıldı - sadece tarih bazlı kontrol yapılacak
    };
    
    if (minCapacity) {
      query.capacity = { $gte: minCapacity };
    }

    const rooms = await this.roomsCollection.find(query).toArray();

    // If dates provided, filter out rooms with conflicting reservations
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      const availableRooms: Room[] = [];
      
      for (const room of rooms) {
        const hasConflict = await this.checkRoomConflict(room._id.toString(), checkIn, checkOut);
        if (!hasConflict) {
          availableRooms.push(room);
        }
      }
      
      return availableRooms;
    }

    // If no dates provided, return all active rooms
    return rooms;
  }

  // Oda çakışma kontrolü
  private async checkRoomConflict(roomId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
    const conflictingReservations = await this.reservationsCollection.find({
      roomId: new ObjectId(roomId),
      status: { $in: ['confirmed', 'checked_in'] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn }
        }
      ]
    }).toArray();

    return conflictingReservations.length > 0;
  }

  // Oda durumlarını rezervasyonlara göre güncelle
  async updateRoomStatusBasedOnReservations(): Promise<void> {
    const now = new Date();
    const rooms = await this.roomsCollection.find({ isActive: true }).toArray();

    for (const room of rooms) {
      // Şu anda aktif rezervasyonları kontrol et
      const activeReservations = await this.reservationsCollection.find({
        roomId: room._id,
        status: { $in: ['confirmed', 'checked_in'] },
        checkInDate: { $lte: now },
        checkOutDate: { $gt: now }
      }).toArray();

      let newStatus = RoomStatus.AVAILABLE;
      
      if (activeReservations.length > 0) {
        newStatus = RoomStatus.OCCUPIED;
      }

      // Sadece status değişmişse güncelle
      if (room.status !== newStatus) {
        await this.roomsCollection.updateOne(
          { _id: room._id },
          { $set: { status: newStatus, updatedAt: new Date() } }
        );
      }
    }
  }

  // Oda tipine göre istatistikler
  async getRoomStatistics() {
    const stats = await this.roomsCollection.aggregate([
      {
        $group: {
          _id: '$type',
          totalRooms: { $sum: 1 },
          availableRooms: {
            $sum: {
              $cond: [{ $eq: ['$status', RoomStatus.AVAILABLE] }, 1, 0]
            }
          },
          occupiedRooms: {
            $sum: {
              $cond: [{ $eq: ['$status', RoomStatus.OCCUPIED] }, 1, 0]
            }
          },
          averagePrice: { $avg: '$price' },
          totalCapacity: { $sum: '$capacity' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();

    return stats;
  }

  // Tüm odaları müsait olarak işaretle (basit çözüm)
  async resetAllRoomsAvailable(): Promise<void> {
    await this.roomsCollection.updateMany(
      { isActive: true },
      { $set: { status: RoomStatus.AVAILABLE, updatedAt: new Date() } }
    );
  }
} 