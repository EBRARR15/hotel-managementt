import { IsString, IsEmail, IsDateString, IsNumber, IsOptional, IsEnum, Min, Max, MinLength } from 'class-validator';
import { ReservationStatus } from '../interfaces/reservation.interface';

export class UpdateReservationDto {
  @IsString()
  @MinLength(2, { message: 'Misafir adı en az 2 karakter olmalıdır' })
  @IsOptional()
  guestName?: string;

  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  @IsOptional()
  guestEmail?: string;

  @IsString()
  @MinLength(10, { message: 'Telefon numarası en az 10 karakter olmalıdır' })
  @IsOptional()
  guestPhone?: string;

  @IsDateString({}, { message: 'Geçerli bir check-in tarihi giriniz' })
  @IsOptional()
  checkInDate?: string;

  @IsDateString({}, { message: 'Geçerli bir check-out tarihi giriniz' })
  @IsOptional()
  checkOutDate?: string;

  @IsNumber({}, { message: 'Misafir sayısı sayı olmalıdır' })
  @Min(1, { message: 'En az 1 misafir olmalıdır' })
  @Max(10, { message: 'En fazla 10 misafir olabilir' })
  @IsOptional()
  numberOfGuests?: number;

  @IsEnum(ReservationStatus, { message: 'Geçerli bir rezervasyon durumu seçiniz' })
  @IsOptional()
  status?: ReservationStatus;

  @IsString()
  @IsOptional()
  notes?: string;
} 