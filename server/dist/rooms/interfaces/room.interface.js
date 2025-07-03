"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROOM_PRICING = exports.RoomStatus = exports.RoomType = void 0;
var RoomType;
(function (RoomType) {
    RoomType["BASIC"] = "basic";
    RoomType["PREMIUM"] = "premium";
    RoomType["SUITE"] = "suite";
})(RoomType || (exports.RoomType = RoomType = {}));
var RoomStatus;
(function (RoomStatus) {
    RoomStatus["AVAILABLE"] = "available";
    RoomStatus["OCCUPIED"] = "occupied";
    RoomStatus["MAINTENANCE"] = "maintenance";
    RoomStatus["OUT_OF_ORDER"] = "out_of_order";
})(RoomStatus || (exports.RoomStatus = RoomStatus = {}));
exports.ROOM_PRICING = {
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
//# sourceMappingURL=room.interface.js.map