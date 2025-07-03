import { ObjectId } from 'mongodb';

export enum RoomType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  SUITE = 'suite',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order',
}

export interface Room {
  _id?: ObjectId;
  roomNumber: string;
  type: RoomType;
  status: RoomStatus;
  floor: number;
  capacity: number;
  size: number; // square meters
  price: number; // per night
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

// Room pricing by type
export const ROOM_PRICING = {
  [RoomType.BASIC]: {
    basePrice: 150,
    description: 'Standart oda - Temel ihtiyaçlarınız için',
    defaultAmenities: ['Wi-Fi', 'Klima', 'Televizyon', 'Minibar'],
  },
  [RoomType.PREMIUM]: {
    basePrice: 300,
    description: 'Premium oda - Konfor ve lüks bir arada',
    defaultAmenities: ['Wi-Fi', 'Klima', 'Televizyon', 'Minibar', 'Jakuzi', 'Balkon', 'Room Service'],
  },
  [RoomType.SUITE]: {
    basePrice: 500,
    description: 'Suit oda - En üst düzey lüks deneyim',
    defaultAmenities: ['Wi-Fi', 'Klima', 'Televizyon', 'Minibar', 'Jakuzi', 'Balkon', 'Room Service', 'Butler Service', 'Salon'],
  },
}; 