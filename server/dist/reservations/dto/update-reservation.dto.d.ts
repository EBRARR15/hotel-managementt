import { ReservationStatus } from '../interfaces/reservation.interface';
export declare class UpdateReservationDto {
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    checkInDate?: string;
    checkOutDate?: string;
    numberOfGuests?: number;
    status?: ReservationStatus;
    notes?: string;
}
