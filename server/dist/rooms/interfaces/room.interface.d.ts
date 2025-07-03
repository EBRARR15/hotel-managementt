import { ObjectId } from 'mongodb';
export declare enum RoomType {
    BASIC = "basic",
    PREMIUM = "premium",
    SUITE = "suite"
}
export declare enum RoomStatus {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    MAINTENANCE = "maintenance",
    OUT_OF_ORDER = "out_of_order"
}
export interface Room {
    _id?: ObjectId;
    roomNumber: string;
    type: RoomType;
    status: RoomStatus;
    floor: number;
    capacity: number;
    size: number;
    price: number;
    description?: string;
    amenities: string[];
    images?: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface RoomAvailability {
    roomId: ObjectId;
    date: Date;
    isAvailable: boolean;
    reservationId?: ObjectId;
}
export declare const ROOM_PRICING: {
    basic: {
        basePrice: number;
        description: string;
        defaultAmenities: string[];
    };
    premium: {
        basePrice: number;
        description: string;
        defaultAmenities: string[];
    };
    suite: {
        basePrice: number;
        description: string;
        defaultAmenities: string[];
    };
};
