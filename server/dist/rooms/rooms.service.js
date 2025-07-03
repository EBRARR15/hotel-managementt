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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const database_service_1 = require("../database/database.service");
const room_interface_1 = require("./interfaces/room.interface");
let RoomsService = class RoomsService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    get roomsCollection() {
        return this.databaseService.getCollection('rooms');
    }
    get reservationsCollection() {
        return this.databaseService.getCollection('reservations');
    }
    async create(createRoomDto) {
        const existingRoom = await this.roomsCollection.findOne({
            roomNumber: createRoomDto.roomNumber
        });
        if (existingRoom) {
            throw new common_1.ConflictException(`${createRoomDto.roomNumber} numaralı oda zaten mevcut`);
        }
        const amenities = createRoomDto.amenities || room_interface_1.ROOM_PRICING[createRoomDto.type].defaultAmenities;
        const price = createRoomDto.price || room_interface_1.ROOM_PRICING[createRoomDto.type].basePrice;
        const newRoom = {
            ...createRoomDto,
            amenities,
            price,
            status: createRoomDto.status || room_interface_1.RoomStatus.AVAILABLE,
            isActive: createRoomDto.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await this.roomsCollection.insertOne(newRoom);
        return { ...newRoom, _id: result.insertedId };
    }
    async findAll(filters) {
        const query = {};
        if (filters) {
            if (filters.type)
                query.type = filters.type;
            if (filters.status)
                query.status = filters.status;
            if (filters.floor !== undefined)
                query.floor = filters.floor;
            if (filters.capacity)
                query.capacity = { $gte: filters.capacity };
            if (filters.minPrice || filters.maxPrice) {
                query.price = {};
                if (filters.minPrice)
                    query.price.$gte = filters.minPrice;
                if (filters.maxPrice)
                    query.price.$lte = filters.maxPrice;
            }
            if (filters.isActive !== undefined)
                query.isActive = filters.isActive;
        }
        return await this.roomsCollection.find(query).sort({ floor: 1, roomNumber: 1 }).toArray();
    }
    async findOne(id) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Geçersiz oda ID formatı');
        }
        const room = await this.roomsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!room) {
            throw new common_1.NotFoundException('Oda bulunamadı');
        }
        return room;
    }
    async findByRoomNumber(roomNumber) {
        const room = await this.roomsCollection.findOne({ roomNumber });
        if (!room) {
            throw new common_1.NotFoundException(`${roomNumber} numaralı oda bulunamadı`);
        }
        return room;
    }
    async update(id, updateRoomDto) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Geçersiz oda ID formatı');
        }
        if (updateRoomDto.roomNumber) {
            const existingRoom = await this.roomsCollection.findOne({
                roomNumber: updateRoomDto.roomNumber,
                _id: { $ne: new mongodb_1.ObjectId(id) }
            });
            if (existingRoom) {
                throw new common_1.ConflictException(`${updateRoomDto.roomNumber} numaralı oda zaten mevcut`);
            }
        }
        const updateData = {
            ...updateRoomDto,
            updatedAt: new Date(),
        };
        const result = await this.roomsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
        if (!result) {
            throw new common_1.NotFoundException('Oda bulunamadı');
        }
        return result;
    }
    async remove(id) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Geçersiz oda ID formatı');
        }
        const room = await this.roomsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!room) {
            throw new common_1.NotFoundException('Oda bulunamadı');
        }
        const result = await this.roomsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Oda silinemedi');
        }
        return { message: `${room.roomNumber} numaralı oda tamamen silindi` };
    }
    async updateStatus(id, status) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Geçersiz oda ID formatı');
        }
        const result = await this.roomsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                status,
                updatedAt: new Date()
            }
        }, { returnDocument: 'after' });
        if (!result) {
            throw new common_1.NotFoundException('Oda bulunamadı');
        }
        return result;
    }
    async getAvailableRooms(minCapacity, checkInDate, checkOutDate) {
        const query = {
            isActive: true
        };
        if (minCapacity) {
            query.capacity = { $gte: minCapacity };
        }
        const rooms = await this.roomsCollection.find(query).toArray();
        if (checkInDate && checkOutDate) {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            const availableRooms = [];
            for (const room of rooms) {
                const hasConflict = await this.checkRoomConflict(room._id.toString(), checkIn, checkOut);
                if (!hasConflict) {
                    availableRooms.push(room);
                }
            }
            return availableRooms;
        }
        return rooms;
    }
    async checkRoomConflict(roomId, checkIn, checkOut) {
        const conflictingReservations = await this.reservationsCollection.find({
            roomId: new mongodb_1.ObjectId(roomId),
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
    async updateRoomStatusBasedOnReservations() {
        const now = new Date();
        const rooms = await this.roomsCollection.find({ isActive: true }).toArray();
        for (const room of rooms) {
            const activeReservations = await this.reservationsCollection.find({
                roomId: room._id,
                status: { $in: ['confirmed', 'checked_in'] },
                checkInDate: { $lte: now },
                checkOutDate: { $gt: now }
            }).toArray();
            let newStatus = room_interface_1.RoomStatus.AVAILABLE;
            if (activeReservations.length > 0) {
                newStatus = room_interface_1.RoomStatus.OCCUPIED;
            }
            if (room.status !== newStatus) {
                await this.roomsCollection.updateOne({ _id: room._id }, { $set: { status: newStatus, updatedAt: new Date() } });
            }
        }
    }
    async getRoomStatistics() {
        const stats = await this.roomsCollection.aggregate([
            {
                $group: {
                    _id: '$type',
                    totalRooms: { $sum: 1 },
                    availableRooms: {
                        $sum: {
                            $cond: [{ $eq: ['$status', room_interface_1.RoomStatus.AVAILABLE] }, 1, 0]
                        }
                    },
                    occupiedRooms: {
                        $sum: {
                            $cond: [{ $eq: ['$status', room_interface_1.RoomStatus.OCCUPIED] }, 1, 0]
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
    async resetAllRoomsAvailable() {
        await this.roomsCollection.updateMany({ isActive: true }, { $set: { status: room_interface_1.RoomStatus.AVAILABLE, updatedAt: new Date() } });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map