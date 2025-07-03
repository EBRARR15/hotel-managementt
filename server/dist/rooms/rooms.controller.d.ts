import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomType, RoomStatus } from './interfaces/room.interface';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    create(createRoomDto: CreateRoomDto): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/room.interface").Room;
    }>;
    findAll(type?: RoomType, status?: RoomStatus, floor?: string, capacity?: string, minPrice?: string, maxPrice?: string, isActive?: string): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/room.interface").Room[];
        count: number;
    }>;
    getAvailableRooms(capacity?: string, checkInDate?: string, checkOutDate?: string): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/room.interface").Room[];
        count: number;
    }>;
    getStatistics(): Promise<{
        success: boolean;
        message: string;
        data: import("bson").Document[];
    }>;
    updateRoomStatuses(): Promise<{
        success: boolean;
        message: string;
    }>;
    resetAllRoomsAvailable(): Promise<{
        success: boolean;
        message: string;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/room.interface").Room;
    }>;
    findByRoomNumber(roomNumber: string): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/room.interface").Room;
    }>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/room.interface").Room;
    }>;
    updateStatus(id: string, status: RoomStatus): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/room.interface").Room;
    }>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
