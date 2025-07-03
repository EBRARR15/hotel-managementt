import { IsEnum, IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min, Max, MinLength } from 'class-validator';
import { RoomType, RoomStatus } from '../interfaces/room.interface';

export class UpdateRoomDto {
  @IsString()
  @MinLength(1, { message: 'Oda numarası gereklidir' })
  @IsOptional()
  roomNumber?: string;

  @IsEnum(RoomType, { message: 'Geçerli bir oda tipi seçiniz (basic, premium, suite)' })
  @IsOptional()
  type?: RoomType;

  @IsEnum(RoomStatus, { message: 'Geçerli bir oda durumu seçiniz' })
  @IsOptional()
  status?: RoomStatus;

  @IsNumber({}, { message: 'Kat numarası sayı olmalıdır' })
  @Min(0, { message: 'Kat numarası 0 veya daha büyük olmalıdır' })
  @Max(50, { message: 'Kat numarası 50\'den küçük olmalıdır' })
  @IsOptional()
  floor?: number;

  @IsNumber({}, { message: 'Kapasite sayı olmalıdır' })
  @Min(1, { message: 'Kapasite en az 1 kişi olmalıdır' })
  @Max(10, { message: 'Kapasite en fazla 10 kişi olabilir' })
  @IsOptional()
  capacity?: number;

  @IsNumber({}, { message: 'Oda boyutu sayı olmalıdır' })
  @Min(10, { message: 'Oda boyutu en az 10 m² olmalıdır' })
  @Max(500, { message: 'Oda boyutu en fazla 500 m² olabilir' })
  @IsOptional()
  size?: number;

  @IsNumber({}, { message: 'Fiyat sayı olmalıdır' })
  @Min(50, { message: 'Gecelik fiyat en az 50₺ olmalıdır' })
  @Max(10000, { message: 'Gecelik fiyat en fazla 10.000₺ olabilir' })
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray({ message: 'Olanaklar dizi formatında olmalıdır' })
  @IsString({ each: true, message: 'Her olanak string olmalıdır' })
  @IsOptional()
  amenities?: string[];

  @IsArray({ message: 'Resimler dizi formatında olmalıdır' })
  @IsString({ each: true, message: 'Her resim URL\'si string olmalıdır' })
  @IsOptional()
  images?: string[];

  @IsBoolean({ message: 'Aktif durumu boolean olmalıdır' })
  @IsOptional()
  isActive?: boolean;
} 