import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from './interfaces/reservation.interface';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(createReservationDto: CreateReservationDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/reservation.interface").Reservation;
    }>;
    findAll(req: any, status?: ReservationStatus, roomId?: string, customerId?: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            _id: import("bson").ObjectId | undefined;
            roomId: import("bson").ObjectId;
            checkInDate: Date;
            checkOutDate: Date;
            status: ReservationStatus;
            numberOfGuests: number;
            guestName: string;
            guestEmail: string;
            guestPhone: string;
            totalPrice: number;
            customerId: null;
            notes: null;
            createdAt: Date;
            updatedAt: Date;
            room: {
                roomNumber: string;
                type: string;
                floor: number;
            } | undefined;
            customer: null;
        }[];
        count: number;
    } | {
        success: boolean;
        message: string;
        data: import("./interfaces/reservation.interface").ReservationWithDetails[];
        count: number;
    }>;
    findMyReservations(req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/reservation.interface").ReservationWithDetails[];
        count: number;
    }>;
    checkAvailability(roomId: string, checkInDate: string, checkOutDate: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            available: boolean;
            conflictingReservations?: any[];
        };
    }>;
    getDailyStats(date?: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findOne(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("./interfaces/reservation.interface").ReservationWithDetails;
    }>;
    update(id: string, updateReservationDto: UpdateReservationDto, req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("./interfaces/reservation.interface").Reservation;
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
