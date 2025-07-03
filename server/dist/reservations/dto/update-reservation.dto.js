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
exports.UpdateReservationDto = void 0;
const class_validator_1 = require("class-validator");
const reservation_interface_1 = require("../interfaces/reservation.interface");
class UpdateReservationDto {
    guestName;
    guestEmail;
    guestPhone;
    checkInDate;
    checkOutDate;
    numberOfGuests;
    status;
    notes;
}
exports.UpdateReservationDto = UpdateReservationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Misafir adı en az 2 karakter olmalıdır' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "guestName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Geçerli bir email adresi giriniz' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "guestEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'Telefon numarası en az 10 karakter olmalıdır' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "guestPhone", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Geçerli bir check-in tarihi giriniz' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "checkInDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Geçerli bir check-out tarihi giriniz' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "checkOutDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Misafir sayısı sayı olmalıdır' }),
    (0, class_validator_1.Min)(1, { message: 'En az 1 misafir olmalıdır' }),
    (0, class_validator_1.Max)(10, { message: 'En fazla 10 misafir olabilir' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateReservationDto.prototype, "numberOfGuests", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(reservation_interface_1.ReservationStatus, { message: 'Geçerli bir rezervasyon durumu seçiniz' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "notes", void 0);
//# sourceMappingURL=update-reservation.dto.js.map