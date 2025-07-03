import { DatabaseService } from '../database/database.service';
import { Reservation, ReservationStatus, ReservationWithDetails } from './interfaces/reservation.interface';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
export declare class ReservationsService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    private get reservationsCollection();
    private get roomsCollection();
    private get usersCollection();
    create(createReservationDto: CreateReservationDto, customerId: string): Promise<Reservation>;
    private checkDateConflict;
    findAll(filters?: {
        status?: ReservationStatus;
        roomId?: string;
        customerId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<ReservationWithDetails[]>;
    findOne(id: string): Promise<ReservationWithDetails>;
    update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private updateRoomStatusBasedOnReservation;
    updateAllRoomStatuses(): Promise<void>;
    findByCustomer(customerId: string): Promise<ReservationWithDetails[]>;
    checkRoomAvailability(roomId: string, checkInDate: string, checkOutDate: string): Promise<{
        available: boolean;
        conflictingReservations?: any[];
    }>;
    getDailyStats(date?: Date): Promise<any>;
}
