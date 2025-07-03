import { IsString, IsEmail, IsDateString, IsNumber, IsOptional, Min, Max, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    description: 'Room ID for the reservation',
    example: '507f1f77bcf86cd799439011'
  })
  @IsString()
  @MinLength(1, { message: 'Oda ID gereklidir' })
  roomId: string;

  @ApiProperty({
    description: 'Guest full name',
    example: 'Ahmet Yılmaz',
    minLength: 2
  })
  @IsString()
  @MinLength(2, { message: 'Misafir adı en az 2 karakter olmalıdır' })
  guestName: string;

  @ApiProperty({
    description: 'Guest email address',
    example: 'ahmet.yilmaz@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  guestEmail: string;

  @ApiProperty({
    description: 'Guest phone number',
    example: '+905551234567',
    minLength: 10
  })
  @IsString()
  @MinLength(10, { message: 'Telefon numarası en az 10 karakter olmalıdır' })
  guestPhone: string;

  @ApiProperty({
    description: 'Check-in date',
    example: '2024-07-10',
    format: 'date'
  })
  @IsDateString({}, { message: 'Geçerli bir check-in tarihi giriniz' })
  checkInDate: string;

  @ApiProperty({
    description: 'Check-out date',
    example: '2024-07-12',
    format: 'date'
  })
  @IsDateString({}, { message: 'Geçerli bir check-out tarihi giriniz' })
  checkOutDate: string;

  @ApiProperty({
    description: 'Number of guests',
    example: 2,
    minimum: 1,
    maximum: 10
  })
  @IsNumber({}, { message: 'Misafir sayısı sayı olmalıdır' })
  @Min(1, { message: 'En az 1 misafir olmalıdır' })
  @Max(10, { message: 'En fazla 10 misafir olabilir' })
  numberOfGuests: number;

  @ApiPropertyOptional({
    description: 'Additional notes for the reservation',
    example: 'Geç varış, özel diyet talebi var'
  })
  @IsString()
  @IsOptional()
  notes?: string;
} 