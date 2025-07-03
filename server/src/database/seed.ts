import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../auth/interfaces/user.interface';
import { RoomType, RoomStatus, ROOM_PRICING } from '../rooms/interfaces/room.interface';

async function seedDatabase() {
  const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
  const dbName = process.env.DB_NAME || 'hotel_booking';

  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const roomsCollection = db.collection('rooms');

    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ 
      email: 'admin@hotel.com' 
    });

    if (!existingAdmin) {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123456', 10);
      
      await usersCollection.insertOne({
        email: 'admin@hotel.com',
        password: adminPassword,
        firstName: 'Hotel',
        lastName: 'Admin',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@hotel.com');
      console.log('🔑 Password: admin123456');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create test customer user
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
        role: UserRole.CUSTOMER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ Test customer user created successfully');
      console.log('📧 Email: customer@test.com');
      console.log('🔑 Password: customer123456');
    } else {
      console.log('ℹ️ Test customer user already exists');
    }

    // Seed Rooms
    const existingRooms = await roomsCollection.countDocuments();
    
    if (existingRooms === 0) {
      const roomsData = [
        // Basic Rooms (1st Floor)
        {
          roomNumber: '101',
          type: RoomType.BASIC,
          status: RoomStatus.AVAILABLE,
          floor: 1,
          capacity: 2,
          size: 25,
          price: ROOM_PRICING[RoomType.BASIC].basePrice,
          description: 'Rahat ve temiz standart oda',
          amenities: ROOM_PRICING[RoomType.BASIC].defaultAmenities,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roomNumber: '102',
          type: RoomType.BASIC,
          status: RoomStatus.AVAILABLE,
          floor: 1,
          capacity: 2,
          size: 25,
          price: ROOM_PRICING[RoomType.BASIC].basePrice,
          description: 'Rahat ve temiz standart oda',
          amenities: ROOM_PRICING[RoomType.BASIC].defaultAmenities,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roomNumber: '103',
          type: RoomType.BASIC,
          status: RoomStatus.OCCUPIED,
          floor: 1,
          capacity: 2,
          size: 25,
          price: ROOM_PRICING[RoomType.BASIC].basePrice,
          description: 'Rahat ve temiz standart oda',
          amenities: ROOM_PRICING[RoomType.BASIC].defaultAmenities,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        
        // Premium Rooms (2nd Floor)
        {
          roomNumber: '201',
          type: RoomType.PREMIUM,
          status: RoomStatus.AVAILABLE,
          floor: 2,
          capacity: 3,
          size: 40,
          price: ROOM_PRICING[RoomType.PREMIUM].basePrice,
          description: 'Konforlu premium oda, jakuzi ve balkon ile',
          amenities: ROOM_PRICING[RoomType.PREMIUM].defaultAmenities,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roomNumber: '202',
          type: RoomType.PREMIUM,
          status: RoomStatus.AVAILABLE,
          floor: 2,
          capacity: 3,
          size: 40,
          price: ROOM_PRICING[RoomType.PREMIUM].basePrice,
          description: 'Konforlu premium oda, jakuzi ve balkon ile',
          amenities: ROOM_PRICING[RoomType.PREMIUM].defaultAmenities,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roomNumber: '203',
          type: RoomType.PREMIUM,
          status: RoomStatus.MAINTENANCE,
          floor: 2,
          capacity: 3,
          size: 40,
          price: ROOM_PRICING[RoomType.PREMIUM].basePrice,
          description: 'Konforlu premium oda, jakuzi ve balkon ile',
          amenities: ROOM_PRICING[RoomType.PREMIUM].defaultAmenities,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        
        // Suite Rooms (3rd Floor)
        {
          roomNumber: '301',
          type: RoomType.SUITE,
          status: RoomStatus.AVAILABLE,
          floor: 3,
          capacity: 4,
          size: 65,
          price: ROOM_PRICING[RoomType.SUITE].basePrice,
          description: 'Lüks suit oda, ayrı salon ve butler servisi ile',
          amenities: ROOM_PRICING[RoomType.SUITE].defaultAmenities,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roomNumber: '302',
          type: RoomType.SUITE,
          status: RoomStatus.AVAILABLE,
          floor: 3,
          capacity: 4,
          size: 65,
          price: ROOM_PRICING[RoomType.SUITE].basePrice,
          description: 'Lüks suit oda, ayrı salon ve butler servisi ile',
          amenities: ROOM_PRICING[RoomType.SUITE].defaultAmenities,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        
        // Additional Basic Rooms (1st Floor)
        {
          roomNumber: '104',
          type: RoomType.BASIC,
          status: RoomStatus.AVAILABLE,
          floor: 1,
          capacity: 1,
          size: 20,
          price: ROOM_PRICING[RoomType.BASIC].basePrice - 30,
          description: 'Tek kişilik standart oda',
          amenities: ['Wi-Fi', 'Klima', 'Televizyon'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roomNumber: '105',
          type: RoomType.BASIC,
          status: RoomStatus.AVAILABLE,
          floor: 1,
          capacity: 4,
          size: 35,
          price: ROOM_PRICING[RoomType.BASIC].basePrice + 50,
          description: 'Aile için büyük standart oda',
          amenities: [...ROOM_PRICING[RoomType.BASIC].defaultAmenities, 'Kahve Makinesi'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await roomsCollection.insertMany(roomsData);
      
      console.log('✅ Room data seeded successfully');
      console.log(`📦 ${roomsData.length} rooms created`);
      console.log('🏨 Room types: Basic (5), Premium (3), Suite (2)');
    } else {
      console.log('ℹ️ Rooms already exist');
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase }; 