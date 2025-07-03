import { RoomType, RoomStatus } from '../interfaces/room.interface';
export declare class CreateRoomDto {
    roomNumber: string;
    type: RoomType;
    status?: RoomStatus;
    floor: number;
    capacity: number;
    size: number;
    price: number;
    description?: string;
    amenities?: string[];
    images?: string[];
    isActive?: boolean;
}
