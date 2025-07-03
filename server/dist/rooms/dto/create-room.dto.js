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
exports.CreateRoomDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const room_interface_1 = require("../interfaces/room.interface");
class CreateRoomDto {
    roomNumber;
    type;
    status = room_interface_1.RoomStatus.AVAILABLE;
    floor;
    capacity;
    size;
    price;
    description;
    amenities;
    images;
    isActive = true;
}
exports.CreateRoomDto = CreateRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Room number (must be unique)',
        example: '101',
        minLength: 1
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Oda numarası gereklidir' }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "roomNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Room type',
        enum: room_interface_1.RoomType,
        example: room_interface_1.RoomType.BASIC
    }),
    (0, class_validator_1.IsEnum)(room_interface_1.RoomType, { message: 'Geçerli bir oda tipi seçiniz (basic, premium, suite)' }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Room status',
        enum: room_interface_1.RoomStatus,
        example: room_interface_1.RoomStatus.AVAILABLE,
        default: room_interface_1.RoomStatus.AVAILABLE
    }),
    (0, class_validator_1.IsEnum)(room_interface_1.RoomStatus, { message: 'Geçerli bir oda durumu seçiniz' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Floor number',
        example: 1,
        minimum: 0,
        maximum: 50
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Kat numarası sayı olmalıdır' }),
    (0, class_validator_1.Min)(0, { message: 'Kat numarası 0 veya daha büyük olmalıdır' }),
    (0, class_validator_1.Max)(50, { message: 'Kat numarası 50\'den küçük olmalıdır' }),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Room capacity (number of guests)',
        example: 2,
        minimum: 1,
        maximum: 10
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Kapasite sayı olmalıdır' }),
    (0, class_validator_1.Min)(1, { message: 'Kapasite en az 1 kişi olmalıdır' }),
    (0, class_validator_1.Max)(10, { message: 'Kapasite en fazla 10 kişi olabilir' }),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Room size in square meters',
        example: 35,
        minimum: 10,
        maximum: 500
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Oda boyutu sayı olmalıdır' }),
    (0, class_validator_1.Min)(10, { message: 'Oda boyutu en az 10 m² olmalıdır' }),
    (0, class_validator_1.Max)(500, { message: 'Oda boyutu en fazla 500 m² olabilir' }),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price per night in Turkish Lira',
        example: 250,
        minimum: 50,
        maximum: 10000
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Fiyat sayı olmalıdır' }),
    (0, class_validator_1.Min)(50, { message: 'Gecelik fiyat en az 50₺ olmalıdır' }),
    (0, class_validator_1.Max)(10000, { message: 'Gecelik fiyat en fazla 10.000₺ olabilir' }),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Room description',
        example: 'Şehir manzaralı, ferah ve konforlu oda'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of room amenities',
        example: ['WiFi', 'Klima', 'Minibar', 'TV'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)({ message: 'Olanaklar dizi formatında olmalıdır' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Her olanak string olmalıdır' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRoomDto.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of room image URLs',
        example: ['https://example.com/room1.jpg', 'https://example.com/room2.jpg'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)({ message: 'Resimler dizi formatında olmalıdır' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Her resim URL\'si string olmalıdır' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRoomDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the room is active',
        example: true,
        default: true
    }),
    (0, class_validator_1.IsBoolean)({ message: 'Aktif durumu boolean olmalıdır' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRoomDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-room.dto.js.map