import { ObjectId } from 'mongodb';
export declare enum ReservationStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CHECKED_IN = "checked_in",
    CHECKED_OUT = "checked_out",
    CANCELLED = "cancelled"
}
export interface Reservation {
    _id?: ObjectId;
    roomId: ObjectId;
    customerId: ObjectId;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    totalPrice: number;
    status: ReservationStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ReservationWithDetails extends Reservation {
    room?: {
        roomNumber: string;
        type: string;
        floor: number;
    };
    customer?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}
