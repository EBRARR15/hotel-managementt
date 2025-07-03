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
exports.UpdateRoomDto = void 0;
const class_validator_1 = require("class-validator");
const room_interface_1 = require("../interfaces/room.interface");
class UpdateRoomDto {
    roomNumber;
    type;
    status;
    floor;
    capacity;
    size;
    price;
    description;
    amenities;
    images;
    isActive;
}
exports.UpdateRoomDto = UpdateRoomDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Oda numarası gereklidir' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoomDto.prototype, "roomNumber", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(room_interface_1.RoomType, { message: 'Geçerli bir oda tipi seçiniz (basic, premium, suite)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoomDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(room_interface_1.RoomStatus, { message: 'Geçerli bir oda durumu seçiniz' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoomDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Kat numarası sayı olmalıdır' }),
    (0, class_validator_1.Min)(0, { message: 'Kat numarası 0 veya daha büyük olmalıdır' }),
    (0, class_validator_1.Max)(50, { message: 'Kat numarası 50\'den küçük olmalıdır' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateRoomDto.prototype, "floor", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Kapasite sayı olmalıdır' }),
    (0, class_validator_1.Min)(1, { message: 'Kapasite en az 1 kişi olmalıdır' }),
    (0, class_validator_1.Max)(10, { message: 'Kapasite en fazla 10 kişi olabilir' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateRoomDto.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Oda boyutu sayı olmalıdır' }),
    (0, class_validator_1.Min)(10, { message: 'Oda boyutu en az 10 m² olmalıdır' }),
    (0, class_validator_1.Max)(500, { message: 'Oda boyutu en fazla 500 m² olabilir' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateRoomDto.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Fiyat sayı olmalıdır' }),
    (0, class_validator_1.Min)(50, { message: 'Gecelik fiyat en az 50₺ olmalıdır' }),
    (0, class_validator_1.Max)(10000, { message: 'Gecelik fiyat en fazla 10.000₺ olabilir' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateRoomDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoomDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Olanaklar dizi formatında olmalıdır' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Her olanak string olmalıdır' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateRoomDto.prototype, "amenities", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Resimler dizi formatında olmalıdır' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Her resim URL\'si string olmalıdır' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateRoomDto.prototype, "images", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'Aktif durumu boolean olmalıdır' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRoomDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-room.dto.js.map