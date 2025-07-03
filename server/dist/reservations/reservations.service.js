"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const database_service_1 = require("../database/database.service");
const reservation_interface_1 = require("./interfaces/reservation.interface");
let ReservationsService = class ReservationsService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    get reservationsCollection() {
        return this.databaseService.getCollection('reservations');
    }
    get roomsCollection() {
        return this.databaseService.getCollection('rooms');
    }
    get usersCollection() {
        return this.databaseService.getCollection('users');
    }
    async create(createReservationDto, customerId) {
        const { roomId, checkInDate, checkOutDate, numberOfGuests, ...reservationData } = createReservationDto;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (checkIn < today) {
            throw new common_1.BadRequestException('Check-in tarihi bugünden önce olamaz');
        }
        if (checkOut <= checkIn) {
            throw new common_1.BadRequestException('Check-out tarihi check-in tarihinden sonra olmalıdır');
        }
        if (!mongodb_1.ObjectId.isValid(roomId)) {
            throw new common_1.BadRequestException('Geçersiz oda ID formatı');
        }
        const room = await this.roomsCollection.findOne({ _id: new mongodb_1.ObjectId(roomId) });
        if (!room) {
            throw new common_1.NotFoundException('Oda bulunamadı');
        }
        if (!room.isActive || room.status !== 'available') {
            throw new common_1.ConflictException('Bu oda şu anda müsait değil');
        }
        if (numberOfGuests > room.capacity) {
            throw new common_1.BadRequestException(`Bu oda en fazla ${room.capacity} kişi kapasiteli`);
        }
        const conflictingReservation = await this.checkDateConflict(roomId, checkIn, checkOut);
        if (conflictingReservation) {
            throw new common_1.ConflictException('Bu tarihler arasında oda zaten rezerve edilmiş');
        }
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * room.price;
        const newReservation = {
            roomId: new mongodb_1.ObjectId(roomId),
            customerId: new mongodb_1.ObjectId(customerId),
            guestName: reservationData.guestName,
            guestEmail: reservationData.guestEmail,
            guestPhone: reservationData.guestPhone,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            numberOfGuests,
            totalPrice,
            status: reservation_interface_1.ReservationStatus.CONFIRMED,
            notes: reservationData.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await this.reservationsCollection.insertOne(newReservation);
        return { ...newReservation, _id: result.insertedId };
    }
    async checkDateConflict(roomId, checkIn, checkOut, excludeReservationId) {
        const query = {
            roomId: new mongodb_1.ObjectId(roomId),
            status: { $in: [reservation_interface_1.ReservationStatus.CONFIRMED, reservation_interface_1.ReservationStatus.CHECKED_IN] },
            $or: [
                {
                    checkInDate: { $lt: checkOut },
                    checkOutDate: { $gt: checkIn }
                }
            ]
        };
        if (excludeReservationId) {
            query._id = { $ne: new mongodb_1.ObjectId(excludeReservationId) };
        }
        const conflictingReservation = await this.reservationsCollection.findOne(query);
        return !!conflictingReservation;
    }
    async findAll(filters) {
        const query = {};
        if (filters) {
            if (filters.status)
                query.status = filters.status;
            if (filters.roomId)
                query.roomId = new mongodb_1.ObjectId(filters.roomId);
            if (filters.customerId)
                query.customerId = new mongodb_1.ObjectId(filters.customerId);
            if (filters.startDate || filters.endDate) {
                query.checkInDate = {};
                if (filters.startDate)
                    query.checkInDate.$gte = filters.startDate;
                if (filters.endDate)
                    query.checkInDate.$lte = filters.endDate;
            }
        }
        const reservations = await this.reservationsCollection.find(query).sort({ checkInDate: -1 }).toArray();
        const reservationsWithDetails = [];
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
    async findOne(id) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Geçersiz rezervasyon ID formatı');
        }
        const reservation = await this.reservationsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!reservation) {
            throw new common_1.NotFoundException('Rezervasyon bulunamadı');
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
    async update(id, updateReservationDto) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Geçersiz rezervasyon ID formatı');
        }
        const existingReservation = await this.reservationsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!existingReservation) {
            throw new common_1.NotFoundException('Rezervasyon bulunamadı');
        }
        const updateData = {
            ...updateReservationDto,
            updatedAt: new Date(),
        };
        if (updateReservationDto.checkInDate || updateReservationDto.checkOutDate) {
            const checkIn = updateReservationDto.checkInDate
                ? new Date(updateReservationDto.checkInDate)
                : existingReservation.checkInDate;
            const checkOut = updateReservationDto.checkOutDate
                ? new Date(updateReservationDto.checkOutDate)
                : existingReservation.checkOutDate;
            if (checkOut <= checkIn) {
                throw new common_1.BadRequestException('Check-out tarihi check-in tarihinden sonra olmalıdır');
            }
            updateData.checkInDate = checkIn;
            updateData.checkOutDate = checkOut;
            const room = await this.roomsCollection.findOne({ _id: existingReservation.roomId });
            if (room) {
                const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                updateData.totalPrice = nights * room.price;
            }
        }
        const result = await this.reservationsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException('Rezervasyon güncellenemedi');
        }
        return await this.reservationsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
    }
    async remove(id) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Geçersiz rezervasyon ID formatı');
        }
        const reservation = await this.reservationsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!reservation) {
            throw new common_1.NotFoundException('Rezervasyon bulunamadı');
        }
        const result = await this.reservationsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Rezervasyon silinemedi');
        }
        return { message: 'Rezervasyon başarıyla silindi' };
    }
    async updateRoomStatusBasedOnReservation(roomId, newStatus) {
        const now = new Date();
        const activeReservations = await this.reservationsCollection.find({
            roomId: new mongodb_1.ObjectId(roomId),
            status: { $in: [reservation_interface_1.ReservationStatus.CONFIRMED, reservation_interface_1.ReservationStatus.CHECKED_IN] },
            checkInDate: { $lte: now },
            checkOutDate: { $gt: now }
        }).toArray();
        let roomStatus = 'available';
        if (activeReservations.length > 0) {
            roomStatus = 'occupied';
        }
        else {
            const futureReservations = await this.reservationsCollection.find({
                roomId: new mongodb_1.ObjectId(roomId),
                status: { $in: [reservation_interface_1.ReservationStatus.CONFIRMED] },
                checkInDate: { $gt: now }
            }).toArray();
            if (futureReservations.length > 0) {
                roomStatus = 'available';
            }
        }
        await this.roomsCollection.updateOne({ _id: new mongodb_1.ObjectId(roomId) }, { $set: { status: roomStatus, updatedAt: new Date() } });
    }
    async updateAllRoomStatuses() {
        const rooms = await this.roomsCollection.find({ isActive: true }).toArray();
        for (const room of rooms) {
            await this.updateRoomStatusBasedOnReservation(room._id.toString());
        }
    }
    async findByCustomer(customerId) {
        if (!mongodb_1.ObjectId.isValid(customerId)) {
            throw new common_1.BadRequestException('Geçersiz müşteri ID formatı');
        }
        return this.findAll({ customerId });
    }
    async checkRoomAvailability(roomId, checkInDate, checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const conflictingReservations = await this.reservationsCollection.find({
            roomId: new mongodb_1.ObjectId(roomId),
            status: { $in: [reservation_interface_1.ReservationStatus.CONFIRMED, reservation_interface_1.ReservationStatus.CHECKED_IN] },
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
    async getDailyStats(date) {
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
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map