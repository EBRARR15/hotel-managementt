import { IsEnum, IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min, Max, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoomType, RoomStatus } from '../interfaces/room.interface';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Room number (must be unique)',
    example: '101',
    minLength: 1
  })
  @IsString()
  @MinLength(1, { message: 'Oda numarası gereklidir' })
  roomNumber: string;

  @ApiProperty({
    description: 'Room type',
    enum: RoomType,
    example: RoomType.BASIC
  })
  @IsEnum(RoomType, { message: 'Geçerli bir oda tipi seçiniz (basic, premium, suite)' })
  type: RoomType;

  @ApiPropertyOptional({
    description: 'Room status',
    enum: RoomStatus,
    example: RoomStatus.AVAILABLE,
    default: RoomStatus.AVAILABLE
  })
  @IsEnum(RoomStatus, { message: 'Geçerli bir oda durumu seçiniz' })
  @IsOptional()
  status?: RoomStatus = RoomStatus.AVAILABLE;

  @ApiProperty({
    description: 'Floor number',
    example: 1,
    minimum: 0,
    maximum: 50
  })
  @IsNumber({}, { message: 'Kat numarası sayı olmalıdır' })
  @Min(0, { message: 'Kat numarası 0 veya daha büyük olmalıdır' })
  @Max(50, { message: 'Kat numarası 50\'den küçük olmalıdır' })
  floor: number;

  @ApiProperty({
    description: 'Room capacity (number of guests)',
    example: 2,
    minimum: 1,
    maximum: 10
  })
  @IsNumber({}, { message: 'Kapasite sayı olmalıdır' })
  @Min(1, { message: 'Kapasite en az 1 kişi olmalıdır' })
  @Max(10, { message: 'Kapasite en fazla 10 kişi olabilir' })
  capacity: number;

  @ApiProperty({
    description: 'Room size in square meters',
    example: 35,
    minimum: 10,
    maximum: 500
  })
  @IsNumber({}, { message: 'Oda boyutu sayı olmalıdır' })
  @Min(10, { message: 'Oda boyutu en az 10 m² olmalıdır' })
  @Max(500, { message: 'Oda boyutu en fazla 500 m² olabilir' })
  size: number;

  @ApiProperty({
    description: 'Price per night in Turkish Lira',
    example: 250,
    minimum: 50,
    maximum: 10000
  })
  @IsNumber({}, { message: 'Fiyat sayı olmalıdır' })
  @Min(50, { message: 'Gecelik fiyat en az 50₺ olmalıdır' })
  @Max(10000, { message: 'Gecelik fiyat en fazla 10.000₺ olabilir' })
  price: number;

  @ApiPropertyOptional({
    description: 'Room description',
    example: 'Şehir manzaralı, ferah ve konforlu oda'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'List of room amenities',
    example: ['WiFi', 'Klima', 'Minibar', 'TV'],
    type: [String]
  })
  @IsArray({ message: 'Olanaklar dizi formatında olmalıdır' })
  @IsString({ each: true, message: 'Her olanak string olmalıdır' })
  @IsOptional()
  amenities?: string[];

  @ApiPropertyOptional({
    description: 'List of room image URLs',
    example: ['https://example.com/room1.jpg', 'https://example.com/room2.jpg'],
    type: [String]
  })
  @IsArray({ message: 'Resimler dizi formatında olmalıdır' })
  @IsString({ each: true, message: 'Her resim URL\'si string olmalıdır' })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({
    description: 'Whether the room is active',
    example: true,
    default: true
  })
  @IsBoolean({ message: 'Aktif durumu boolean olmalıdır' })
  @IsOptional()
  isActive?: boolean = true;
} 