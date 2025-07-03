import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db, Collection, Document } from 'mongodb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  async onModuleInit() {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    const dbName = process.env.DB_NAME || 'hotel_booking';

    this.client = new MongoClient(mongoUrl);
    await this.client.connect();
    this.db = this.client.db(dbName);
    
    console.log('✅ Connected to MongoDB successfully');
  }

  async onModuleDestroy() {
    await this.client?.close();
    console.log('❌ Disconnected from MongoDB');
  }

  getDb(): Db {
    return this.db;
  }

  getCollection<T extends Document = Document>(name: string): Collection<T> {
    return this.db.collection<T>(name);
  }
} 