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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rooms_service_1 = require("./rooms.service");
const create_room_dto_1 = require("./dto/create-room.dto");
const update_room_dto_1 = require("./dto/update-room.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_interface_1 = require("../auth/interfaces/user.interface");
const room_interface_1 = require("./interfaces/room.interface");
let RoomsController = class RoomsController {
    roomsService;
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    async create(createRoomDto) {
        const room = await this.roomsService.create(createRoomDto);
        return {
            success: true,
            message: 'Oda başarıyla oluşturuldu',
            data: room
        };
    }
    async findAll(type, status, floor, capacity, minPrice, maxPrice, isActive) {
        const filters = {};
        if (type)
            filters.type = type;
        if (status)
            filters.status = status;
        if (floor)
            filters.floor = parseInt(floor);
        if (capacity)
            filters.capacity = parseInt(capacity);
        if (minPrice)
            filters.minPrice = parseFloat(minPrice);
        if (maxPrice)
            filters.maxPrice = parseFloat(maxPrice);
        if (isActive !== undefined)
            filters.isActive = isActive === 'true';
        const rooms = await this.roomsService.findAll(filters);
        return {
            success: true,
            message: 'Odalar başarıyla listelendi',
            data: rooms,
            count: rooms.length
        };
    }
    async getAvailableRooms(capacity, checkInDate, checkOutDate) {
        const minCapacity = capacity ? parseInt(capacity) : undefined;
        const rooms = await this.roomsService.getAvailableRooms(minCapacity, checkInDate, checkOutDate);
        return {
            success: true,
            message: 'Müsait odalar listelendi',
            data: rooms,
            count: rooms.length
        };
    }
    async getStatistics() {
        const stats = await this.roomsService.getRoomStatistics();
        return {
            success: true,
            message: 'Oda istatistikleri',
            data: stats
        };
    }
    async updateRoomStatuses() {
        await this.roomsService.updateRoomStatusBasedOnReservations();
        return {
            success: true,
            message: 'Oda durumları rezervasyonlara göre güncellendi'
        };
    }
    async resetAllRoomsAvailable() {
        await this.roomsService.resetAllRoomsAvailable();
        return {
            success: true,
            message: 'Tüm odalar müsait olarak işaretlendi'
        };
    }
    async findOne(id) {
        const room = await this.roomsService.findOne(id);
        return {
            success: true,
            message: 'Oda detayları',
            data: room
        };
    }
    async findByRoomNumber(roomNumber) {
        const room = await this.roomsService.findByRoomNumber(roomNumber);
        return {
            success: true,
            message: 'Oda detayları',
            data: room
        };
    }
    async update(id, updateRoomDto) {
        const room = await this.roomsService.update(id, updateRoomDto);
        return {
            success: true,
            message: 'Oda başarıyla güncellendi',
            data: room
        };
    }
    async updateStatus(id, status) {
        const room = await this.roomsService.updateStatus(id, status);
        return {
            success: true,
            message: 'Oda durumu güncellendi',
            data: room
        };
    }
    async remove(id) {
        const result = await this.roomsService.remove(id);
        return {
            success: true,
            ...result
        };
    }
};
exports.RoomsController = RoomsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_interface_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new room (Admin only)' }),
    (0, swagger_1.ApiBody)({ type: create_room_dto_1.CreateRoomDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Room successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Room with this number already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all rooms with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: room_interface_1.RoomType, required: false, description: 'Filter by room type' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: room_interface_1.RoomStatus, required: false, description: 'Filter by room status' }),
    (0, swagger_1.ApiQuery)({ name: 'floor', type: 'number', required: false, description: 'Filter by floor number' }),
    (0, swagger_1.ApiQuery)({ name: 'capacity', type: 'number', required: false, description: 'Minimum capacity' }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', type: 'number', required: false, description: 'Minimum price' }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', type: 'number', required: false, description: 'Maximum price' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', type: 'boolean', required: false, description: 'Filter by active status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rooms retrieved successfully' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('floor')),
    __param(3, (0, common_1.Query)('capacity')),
    __param(4, (0, common_1.Query)('minPrice')),
    __param(5, (0, common_1.Query)('maxPrice')),
    __param(6, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available rooms' }),
    (0, swagger_1.ApiQuery)({ name: 'capacity', type: 'number', required: false, description: 'Minimum capacity' }),
    (0, swagger_1.ApiQuery)({ name: 'checkInDate', type: 'string', required: false, description: 'Check-in date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'checkOutDate', type: 'string', required: false, description: 'Check-out date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available rooms retrieved successfully' }),
    __param(0, (0, common_1.Query)('capacity')),
    __param(1, (0, common_1.Query)('checkInDate')),
    __param(2, (0, common_1.Query)('checkOutDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getAvailableRooms", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_interface_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get room statistics (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Post)('update-statuses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_interface_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update room statuses based on reservations (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room statuses updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "updateRoomStatuses", null);
__decorate([
    (0, common_1.Post)('reset-available'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_interface_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset all rooms to available status (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All rooms reset to available status' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "resetAllRoomsAvailable", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get room by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Room not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid room ID format' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('number/:roomNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Get room by room number' }),
    (0, swagger_1.ApiParam)({ name: 'roomNumber', description: 'Room number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Room not found' }),
    __param(0, (0, common_1.Param)('roomNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "findByRoomNumber", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_interface_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update room (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiBody)({ type: update_room_dto_1.UpdateRoomDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Room not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Room number already exists' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_dto_1.UpdateRoomDto]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_interface_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update room status (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { status: { enum: Object.values(room_interface_1.RoomStatus) } } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Room not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_interface_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete room (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Room ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Room not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "remove", null);
exports.RoomsController = RoomsController = __decorate([
    (0, swagger_1.ApiTags)('rooms'),
    (0, common_1.Controller)('rooms'),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsController);
//# sourceMappingURL=rooms.controller.js.map