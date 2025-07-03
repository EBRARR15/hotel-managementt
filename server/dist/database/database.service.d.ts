import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Db, Collection, Document } from 'mongodb';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private client;
    private db;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getDb(): Db;
    getCollection<T extends Document = Document>(name: string): Collection<T>;
}
