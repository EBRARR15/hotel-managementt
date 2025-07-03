import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query,
  HttpStatus,
  HttpCode,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../auth/interfaces/user.interface';
import { ReservationStatus } from './interfaces/reservation.interface';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
@ApiTags('Reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Yeni rezervasyon oluştur (Müşteri ve Admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: 201, description: 'Reservation created successfully' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateReservationDto })
  async create(@Body() createReservationDto: CreateReservationDto, @Request() req: any) {
    const reservation = await this.reservationsService.create(createReservationDto, req.user.userId);
    return {
      success: true,
      message: 'Rezervasyon başarıyla oluşturuldu',
      data: reservation
    };
  }

  // Tüm rezervasyonları listele (Authenticated users - filtered by role)
  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  @ApiResponse({ status: 200, description: 'Reservations retrieved successfully' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'status', enum: ReservationStatus, required: false })
  @ApiQuery({ name: 'roomId', required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async findAll(
    @Request() req: any,
    @Query('status') status?: ReservationStatus,
    @Query('roomId') roomId?: string,
    @Query('customerId') customerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    
    if (status) filters.status = status;
    if (roomId) filters.roomId = roomId;
    if (customerId) filters.customerId = customerId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const reservations = await this.reservationsService.findAll(filters);
    
    // If user is not admin, return only basic availability data without personal details
    if (req.user.role !== UserRole.ADMIN) {
      const filteredReservations = reservations.map(reservation => ({
        _id: reservation._id,
        roomId: reservation.roomId,
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        status: reservation.status,
        numberOfGuests: reservation.numberOfGuests,
        // Remove personal information for non-admin users
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

    // Admin users get full data
    return {
      success: true,
      message: 'Rezervasyonlar başarıyla listelendi',
      data: reservations,
      count: reservations.length
    };
  }

  // Kullanıcının kendi rezervasyonları
  @Get('my-reservations')
  @ApiOperation({ summary: 'Get user reservations' })
  @ApiResponse({ status: 200, description: 'User reservations retrieved successfully' })
  @ApiBearerAuth()
  async findMyReservations(@Request() req: any) {
    const reservations = await this.reservationsService.findByCustomer(req.user.userId);
    return {
      success: true,
      message: 'Rezervasyonlarınız listelendi',
      data: reservations,
      count: reservations.length
    };
  }

  // Oda müsaitlik kontrolü (Herkes erişebilir)
  @Get('check-availability/:roomId')
  @ApiOperation({ summary: 'Check room availability' })
  @ApiResponse({ status: 200, description: 'Room availability checked successfully' })
  @ApiBearerAuth()
  @ApiParam({ name: 'roomId', description: 'Room ID' })
  @ApiQuery({ name: 'checkInDate', required: true })
  @ApiQuery({ name: 'checkOutDate', required: true })
  async checkAvailability(
    @Param('roomId') roomId: string,
    @Query('checkInDate') checkInDate: string,
    @Query('checkOutDate') checkOutDate: string,
  ) {
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

  // Günlük istatistikler (Admin için)
  @Get('daily-stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get daily stats' })
  @ApiResponse({ status: 200, description: 'Daily stats retrieved successfully' })
  @ApiBearerAuth()
  async getDailyStats(@Query('date') date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const stats = await this.reservationsService.getDailyStats(targetDate);
    return {
      success: true,
      message: 'Günlük istatistikler',
      data: stats
    };
  }

  // Belirli bir rezervasyonu getir
  @Get(':id')
  @ApiOperation({ summary: 'Get reservation details' })
  @ApiResponse({ status: 200, description: 'Reservation details retrieved successfully' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const reservation = await this.reservationsService.findOne(id);
    
    // Müşteri sadece kendi rezervasyonunu görebilir
    if (req.user.role === UserRole.CUSTOMER && reservation.customerId?.toString() !== req.user.userId) {
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

  // Rezervasyon güncelle (Sahibi veya Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update reservation' })
  @ApiResponse({ status: 200, description: 'Reservation updated successfully' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiBody({ type: UpdateReservationDto })
  async update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto, @Request() req: any) {
    const existingReservation = await this.reservationsService.findOne(id);
    
    // Müşteri sadece kendi rezervasyonunu güncelleyebilir
    if (req.user.role === UserRole.CUSTOMER) {
      if (existingReservation.customerId?.toString() !== req.user.userId) {
        return {
          success: false,
          message: 'Bu rezervasyonu güncelleme yetkiniz bulunmamaktadır'
        };
      }
      
      // Müşteri sadece belirli alanları güncelleyebilir
      const allowedFields = ['guestName', 'guestEmail', 'guestPhone', 'notes'];
      const filteredDto: any = {};
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

  // Rezervasyon sil (Sahibi veya Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete reservation' })
  @ApiResponse({ status: 200, description: 'Reservation deleted successfully' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const existingReservation = await this.reservationsService.findOne(id);
    
    // Müşteri sadece kendi rezervasyonunu silebilir
    if (req.user.role === UserRole.CUSTOMER && existingReservation.customerId?.toString() !== req.user.userId) {
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
} 