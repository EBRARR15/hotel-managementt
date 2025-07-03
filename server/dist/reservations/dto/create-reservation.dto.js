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
exports.CreateReservationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateReservationDto {
    roomId;
    guestName;
    guestEmail;
    guestPhone;
    checkInDate;
    checkOutDate;
    numberOfGuests;
    notes;
}
exports.CreateReservationDto = CreateReservationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Room ID for the reservation',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Oda ID gereklidir' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Guest full name',
        example: 'Ahmet Yılmaz',
        minLength: 2
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Misafir adı en az 2 karakter olmalıdır' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "guestName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Guest email address',
        example: 'ahmet.yilmaz@example.com',
        format: 'email'
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Geçerli bir email adresi giriniz' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "guestEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Guest phone number',
        example: '+905551234567',
        minLength: 10
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'Telefon numarası en az 10 karakter olmalıdır' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "guestPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Check-in date',
        example: '2024-07-10',
        format: 'date'
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Geçerli bir check-in tarihi giriniz' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "checkInDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Check-out date',
        example: '2024-07-12',
        format: 'date'
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Geçerli bir check-out tarihi giriniz' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "checkOutDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of guests',
        example: 2,
        minimum: 1,
        maximum: 10
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Misafir sayısı sayı olmalıdır' }),
    (0, class_validator_1.Min)(1, { message: 'En az 1 misafir olmalıdır' }),
    (0, class_validator_1.Max)(10, { message: 'En fazla 10 misafir olabilir' }),
    __metadata("design:type", Number)
], CreateReservationDto.prototype, "numberOfGuests", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes for the reservation',
        example: 'Geç varış, özel diyet talebi var'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "notes", void 0);
//# sourceMappingURL=create-reservation.dto.js.map