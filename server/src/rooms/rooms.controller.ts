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
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../auth/interfaces/user.interface';
import { RoomType, RoomStatus } from './interfaces/room.interface';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // Yeni oda oluştur (Sadece Admin)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new room (Admin only)' })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({ status: 201, description: 'Room successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 409, description: 'Room with this number already exists' })
  async create(@Body() createRoomDto: CreateRoomDto) {
    const room = await this.roomsService.create(createRoomDto);
    return {
      success: true,
      message: 'Oda başarıyla oluşturuldu',
      data: room
    };
  }

  // Tüm odaları listele (Filtreleme ile) - Public
  @Get()
  @ApiOperation({ summary: 'Get all rooms with filters' })
  @ApiQuery({ name: 'type', enum: RoomType, required: false, description: 'Filter by room type' })
  @ApiQuery({ name: 'status', enum: RoomStatus, required: false, description: 'Filter by room status' })
  @ApiQuery({ name: 'floor', type: 'number', required: false, description: 'Filter by floor number' })
  @ApiQuery({ name: 'capacity', type: 'number', required: false, description: 'Minimum capacity' })
  @ApiQuery({ name: 'minPrice', type: 'number', required: false, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', type: 'number', required: false, description: 'Maximum price' })
  @ApiQuery({ name: 'isActive', type: 'boolean', required: false, description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  async findAll(
    @Query('type') type?: RoomType,
    @Query('status') status?: RoomStatus,
    @Query('floor') floor?: string,
    @Query('capacity') capacity?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (floor) filters.floor = parseInt(floor);
    if (capacity) filters.capacity = parseInt(capacity);
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const rooms = await this.roomsService.findAll(filters);
    return {
      success: true,
      message: 'Odalar başarıyla listelendi',
      data: rooms,
      count: rooms.length
    };
  }

  // Müsait odaları getir - Public
  @Get('available')
  @ApiOperation({ summary: 'Get available rooms' })
  @ApiQuery({ name: 'capacity', type: 'number', required: false, description: 'Minimum capacity' })
  @ApiQuery({ name: 'checkInDate', type: 'string', required: false, description: 'Check-in date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'checkOutDate', type: 'string', required: false, description: 'Check-out date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Available rooms retrieved successfully' })
  async getAvailableRooms(
    @Query('capacity') capacity?: string,
    @Query('checkInDate') checkInDate?: string,
    @Query('checkOutDate') checkOutDate?: string
  ) {
    const minCapacity = capacity ? parseInt(capacity) : undefined;
    const rooms = await this.roomsService.getAvailableRooms(minCapacity, checkInDate, checkOutDate);
    return {
      success: true,
      message: 'Müsait odalar listelendi',
      data: rooms,
      count: rooms.length
    };
  }

  // Oda istatistikleri (Sadece Admin)
  @Get('statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get room statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Room statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getStatistics() {
    const stats = await this.roomsService.getRoomStatistics();
    return {
      success: true,
      message: 'Oda istatistikleri',
      data: stats
    };
  }

  // Oda durumlarını güncelle (Sadece Admin)
  @Post('update-statuses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update room statuses based on reservations (Admin only)' })
  @ApiResponse({ status: 200, description: 'Room statuses updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async updateRoomStatuses() {
    await this.roomsService.updateRoomStatusBasedOnReservations();
    return {
      success: true,
      message: 'Oda durumları rezervasyonlara göre güncellendi'
    };
  }

  // Tüm odaları müsait olarak işaretle (Sadece Admin)
  @Post('reset-available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reset all rooms to available status (Admin only)' })
  @ApiResponse({ status: 200, description: 'All rooms reset to available status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async resetAllRoomsAvailable() {
    await this.roomsService.resetAllRoomsAvailable();
    return {
      success: true,
      message: 'Tüm odalar müsait olarak işaretlendi'
    };
  }

  // Belirli bir odayı getir - Public
  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 400, description: 'Invalid room ID format' })
  async findOne(@Param('id') id: string) {
    const room = await this.roomsService.findOne(id);
    return {
      success: true,
      message: 'Oda detayları',
      data: room
    };
  }

  // Oda numarasına göre oda getir - Public
  @Get('number/:roomNumber')
  @ApiOperation({ summary: 'Get room by room number' })
  @ApiParam({ name: 'roomNumber', description: 'Room number' })
  @ApiResponse({ status: 200, description: 'Room retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async findByRoomNumber(@Param('roomNumber') roomNumber: string) {
    const room = await this.roomsService.findByRoomNumber(roomNumber);
    return {
      success: true,
      message: 'Oda detayları',
      data: room
    };
  }

  // Oda güncelle (Sadece Admin)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update room (Admin only)' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiBody({ type: UpdateRoomDto })
  @ApiResponse({ status: 200, description: 'Room updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 409, description: 'Room number already exists' })
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    const room = await this.roomsService.update(id, updateRoomDto);
    return {
      success: true,
      message: 'Oda başarıyla güncellendi',
      data: room
    };
  }

  // Oda durumunu güncelle (Sadece Admin)
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update room status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiBody({ schema: { type: 'object', properties: { status: { enum: Object.values(RoomStatus) } } } })
  @ApiResponse({ status: 200, description: 'Room status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: RoomStatus
  ) {
    const room = await this.roomsService.updateStatus(id, status);
    return {
      success: true,
      message: 'Oda durumu güncellendi',
      data: room
    };
  }

  // Oda sil (Soft delete - Sadece Admin)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete room (Admin only)' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async remove(@Param('id') id: string) {
    const result = await this.roomsService.remove(id);
    return {
      success: true,
      ...result
    };
  }
} 