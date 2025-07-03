"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const mongodb_1 = require("mongodb");
const bcrypt = require("bcrypt");
const user_interface_1 = require("../auth/interfaces/user.interface");
const room_interface_1 = require("../rooms/interfaces/room.interface");
async function seedDatabase() {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    const dbName = process.env.DB_NAME || 'hotel_booking';
    const client = new mongodb_1.MongoClient(mongoUrl);
    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');
        const roomsCollection = db.collection('rooms');
        const existingAdmin = await usersCollection.findOne({
            email: 'admin@hotel.com'
        });
        if (!existingAdmin) {
            const adminPassword = await bcrypt.hash('admin123456', 10);
            await usersCollection.insertOne({
                email: 'admin@hotel.com',
                password: adminPassword,
                firstName: 'Hotel',
                lastName: 'Admin',
                role: user_interface_1.UserRole.ADMIN,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('✅ Admin user created successfully');
            console.log('📧 Email: admin@hotel.com');
            console.log('🔑 Password: admin123456');
        }
        else {
            console.log('ℹ️ Admin user already exists');
        }
        const existingCustomer = await usersCollection.findOne({
            email: 'customer@test.com'
        });
        if (!existingCustomer) {
            const customerPassword = await bcrypt.hash('customer123456', 10);
            await usersCollection.insertOne({
                email: 'customer@test.com',
                password: customerPassword,
                firstName: 'Test',
                lastName: 'Customer',
                role: user_interface_1.UserRole.CUSTOMER,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('✅ Test customer user created successfully');
            console.log('📧 Email: customer@test.com');
            console.log('🔑 Password: customer123456');
        }
        else {
            console.log('ℹ️ Test customer user already exists');
        }
        const existingRooms = await roomsCollection.countDocuments();
        if (existingRooms === 0) {
            const roomsData = [
                {
                    roomNumber: '101',
                    type: room_interface_1.RoomType.BASIC,
                    status: room_interface_1.RoomStatus.AVAILABLE,
                    floor: 1,
                    capacity: 2,
                    size: 25,
                    price: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.BASIC].basePrice,
                    description: 'Rahat ve temiz standart oda',
                    amenities: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.BASIC].defaultAmenities,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roomNumber: '102',
                    type: room_interface_1.RoomType.BASIC,
                    status: room_interface_1.RoomStatus.AVAILABLE,
                    floor: 1,
                    capacity: 2,
                    size: 25,
                    price: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.BASIC].basePrice,
                    description: 'Rahat ve temiz standart oda',
                    amenities: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.BASIC].defaultAmenities,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roomNumber: '103',
                    type: room_interface_1.RoomType.BASIC,
                    status: room_interface_1.RoomStatus.OCCUPIED,
                    floor: 1,
                    capacity: 2,
                    size: 25,
                    price: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.BASIC].basePrice,
                    description: 'Rahat ve temiz standart oda',
                    amenities: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.BASIC].defaultAmenities,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roomNumber: '201',
                    type: room_interface_1.RoomType.PREMIUM,
                    status: room_interface_1.RoomStatus.AVAILABLE,
                    floor: 2,
                    capacity: 3,
                    size: 40,
                    price: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.PREMIUM].basePrice,
                    description: 'Konforlu premium oda, jakuzi ve balkon ile',
                    amenities: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.PREMIUM].defaultAmenities,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roomNumber: '202',
                    type: room_interface_1.RoomType.PREMIUM,
                    status: room_interface_1.RoomStatus.AVAILABLE,
                    floor: 2,
                    capacity: 3,
                    size: 40,
                    price: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.PREMIUM].basePrice,
                    description: 'Konforlu premium oda, jakuzi ve balkon ile',
                    amenities: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.PREMIUM].defaultAmenities,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roomNumber: '203',
                    type: room_interface_1.RoomType.PREMIUM,
                    status: room_interface_1.RoomStatus.MAINTENANCE,
                    floor: 2,
                    capacity: 3,
                    size: 40,
                    price: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.PREMIUM].basePrice,
                    description: 'Konforlu premium oda, jakuzi ve balkon ile',
                    amenities: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.PREMIUM].defaultAmenities,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roomNumber: '301',
                    type: room_interface_1.RoomType.SUITE,
                    status: room_interface_1.RoomStatus.AVAILABLE,
                    floor: 3,
                    capacity: 4,
                    size: 65,
                    price: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.SUITE].basePrice,
                    description: 'Lüks suit oda, ayrı salon ve butler servisi ile',
                    amenities: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.SUITE].defaultAmenities,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roomNumber: '302',
                    type: room_interface_1.RoomType.SUITE,
                    status: room_interface_1.RoomStatus.AVAILABLE,
                    floor: 3,
                    capacity: 4,
                    size: 65,
                    price: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.SUITE].basePrice,
                    description: 'Lüks suit oda, ayrı salon ve butler servisi ile',
                    amenities: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.SUITE].defaultAmenities,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roomNumber: '104',
                    type: room_interface_1.RoomType.BASIC,
                    status: room_interface_1.RoomStatus.AVAILABLE,
                    floor: 1,
                    capacity: 1,
                    size: 20,
                    price: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.BASIC].basePrice - 30,
                    description: 'Tek kişilik standart oda',
                    amenities: ['Wi-Fi', 'Klima', 'Televizyon'],
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    roomNumber: '105',
                    type: room_interface_1.RoomType.BASIC,
                    status: room_interface_1.RoomStatus.AVAILABLE,
                    floor: 1,
                    capacity: 4,
                    size: 35,
                    price: room_interface_1.ROOM_PRICING[room_interface_1.RoomType.BASIC].basePrice + 50,
                    description: 'Aile için büyük standart oda',
                    amenities: [...room_interface_1.ROOM_PRICING[room_interface_1.RoomType.BASIC].defaultAmenities, 'Kahve Makinesi'],
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            await roomsCollection.insertMany(roomsData);
            console.log('✅ Room data seeded successfully');
            console.log(`📦 ${roomsData.length} rooms created`);
            console.log('🏨 Room types: Basic (5), Premium (3), Suite (2)');
        }
        else {
            console.log('ℹ️ Rooms already exist');
        }
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
    }
    finally {
        await client.close();
    }
}
if (require.main === module) {
    seedDatabase();
}
//# sourceMappingURL=seed.js.map