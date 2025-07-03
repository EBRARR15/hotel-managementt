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
exports.ReservationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reservations_service_1 = require("./reservations.service");
const create_reservation_dto_1 = require("./dto/create-reservation.dto");
const update_reservation_dto_1 = require("./dto/update-reservation.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_interface_1 = require("../auth/interfaces/user.interface");
const reservation_interface_1 = require("./interfaces/reservation.interface");
let ReservationsController = class ReservationsController {
    reservationsService;
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    async create(createReservationDto, req) {
        const reservation = await this.reservationsService.create(createReservationDto, req.user.userId);
        return {
            success: true,
            message: 'Rezervasyon başarıyla oluşturuldu',
            data: reservation
        };
    }
    async findAll(req, status, roomId, customerId, startDate, endDate) {
        const filters = {};
        if (status)
            filters.status = status;
        if (roomId)
            filters.roomId = roomId;
        if (customerId)
            filters.customerId = customerId;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        const reservations = await this.reservationsService.findAll(filters);
        if (req.user.role !== user_interface_1.UserRole.ADMIN) {
            const filteredReservations = reservations.map(reservation => ({
                _id: reservation._id,
                roomId: reservation.roomId,
                checkInDate: reservation.checkInDate,
                checkOutDate: reservation.checkOutDate,
                status: reservation.status,
                numberOfGuests: reservation.numberOfGuests,
                guestName: 'Gizli',
                guestEmail: 'gizli@example.com',
                guestPhone: 'Gizli',
                totalPrice: 0,
                customerId: null,
                notes: null,
                createdAt: reservation.createdAt,
                updatedAt: reservation.updatedAt,
                room: reservation.room,
                customer: null,
            }));
            return {
                success: true,
                message: 'Müsaitlik bilgileri listelendi',
                data: filteredReservations,
                count: filteredReservations.length
            };
        }
        return {
            success: true,
            message: 'Rezervasyonlar başarıyla listelendi',
            data: reservations,
            count: reservations.length
        };
    }
    async findMyReservations(req) {
        const reservations = await this.reservationsService.findByCustomer(req.user.userId);
        return {
            success: true,
            message: 'Rezervasyonlarınız listelendi',
            data: reservations,
            count: reservations.length
        };
    }
    async checkAvailability(roomId, checkInDate, checkOutDate) {
        if (!checkInDate || !checkOutDate) {
            return {
                success: false,
                message: 'Check-in ve check-out tarihleri gereklidir'
            };
        }
        const availability = await this.reservationsService.checkRoomAvailability(roomId, checkInDate, checkOutDate);
        return {
            success: true,
            message: 'Müsaitlik kontrolü tamamlandı',
            data: availability
        };
    }
    async getDailyStats(date) {
        const targetDate = date ? new Date(date) : new Date();
        const stats = await this.reservationsService.getDailyStats(targetDate);
        return {
            success: true,
            message: 'Günlük istatistikler',
            data: stats
        };
    }
    async findOne(id, req) {
        const reservation = await this.reservationsService.findOne(id);
        if (req.user.role === user_interface_1.UserRole.CUSTOMER && reservation.customerId?.toString() !== req.user.userId) {
            return {
                success: false,
                message: 'Bu rezervasyona erişim yetkiniz bulunmamaktadır'
            };
        }
        return {
            success: true,
            message: 'Rezervasyon detayları',
            data: reservation
        };
    }
    async update(id, updateReservationDto, req) {
        const existingReservation = await this.reservationsService.findOne(id);
        if (req.user.role === user_interface_1.UserRole.CUSTOMER) {
            if (existingReservation.customerId?.toString() !== req.user.userId) {
                return {
                    success: false,
                    message: 'Bu rezervasyonu güncelleme yetkiniz bulunmamaktadır'
                };
            }
            const allowedFields = ['guestName', 'guestEmail', 'guestPhone', 'notes'];
            const filteredDto = {};
            allowedFields.forEach(field => {
                if (updateReservationDto[field] !== undefined) {
                    filteredDto[field] = updateReservationDto[field];
                }
            });
            updateReservationDto = filteredDto;
        }
        const reservation = await this.reservationsService.update(id, updateReservationDto);
        return {
            success: true,
            message: 'Rezervasyon başarıyla güncellendi',
            data: reservation
        };
    }
    async remove(id, req) {
        const existingReservation = await this.reservationsService.findOne(id);
        if (req.user.role === user_interface_1.UserRole.CUSTOMER && existingReservation.customerId?.toString() !== req.user.userId) {
            return {
                success: false,
                message: 'Bu rezervasyonu silme yetkiniz bulunmamaktadır'
            };
        }
        const result = await this.reservationsService.remove(id);
        return {
            success: true,
            ...result
        };
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new reservation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reservation created successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({ type: create_reservation_dto_1.CreateReservationDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reservation_dto_1.CreateReservationDto, Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reservations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reservations retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: reservation_interface_1.ReservationStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'roomId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'customerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('roomId')),
    __param(3, (0, common_1.Query)('customerId')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-reservations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user reservations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User reservations retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "findMyReservations", null);
__decorate([
    (0, common_1.Get)('check-availability/:roomId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check room availability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room availability checked successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'roomId', description: 'Room ID' }),
    (0, swagger_1.ApiQuery)({ name: 'checkInDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'checkOutDate', required: true }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)('checkInDate')),
    __param(2, (0, common_1.Query)('checkOutDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Get)('daily-stats'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_interface_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily stats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daily stats retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getDailyStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reservation details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reservation details retrieved successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Reservation ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update reservation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reservation updated successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Reservation ID' }),
    (0, swagger_1.ApiBody)({ type: update_reservation_dto_1.UpdateReservationDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reservation_dto_1.UpdateReservationDto, Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete reservation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reservation deleted successfully' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Reservation ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "remove", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, common_1.Controller)('reservations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Reservations'),
    __metadata("design:paramtypes", [reservations_service_1.ReservationsService])
], ReservationsController);
//# sourceMappingURL=reservations.controller.js.map