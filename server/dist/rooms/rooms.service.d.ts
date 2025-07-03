import { DatabaseService } from '../database/database.service';
import { Room, RoomType, RoomStatus } from './interfaces/room.interface';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    private get roomsCollection();
    private get reservationsCollection();
    create(createRoomDto: CreateRoomDto): Promise<Room>;
    findAll(filters?: {
        type?: RoomType;
        status?: RoomStatus;
        floor?: number;
        capacity?: number;
        minPrice?: number;
        maxPrice?: number;
        isActive?: boolean;
    }): Promise<Room[]>;
    findOne(id: string): Promise<Room>;
    findByRoomNumber(roomNumber: string): Promise<Room>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateStatus(id: string, status: RoomStatus): Promise<Room>;
    getAvailableRooms(minCapacity?: number, checkInDate?: string, checkOutDate?: string): Promise<Room[]>;
    private checkRoomConflict;
    updateRoomStatusBasedOnReservations(): Promise<void>;
    getRoomStatistics(): Promise<import("bson").Document[]>;
    resetAllRoomsAvailable(): Promise<void>;
}
