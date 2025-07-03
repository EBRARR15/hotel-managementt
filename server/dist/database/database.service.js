"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
let DatabaseService = class DatabaseService {
    client;
    db;
    async onModuleInit() {
        const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
        const dbName = process.env.DB_NAME || 'hotel_booking';
        this.client = new mongodb_1.MongoClient(mongoUrl);
        await this.client.connect();
        this.db = this.client.db(dbName);
        console.log('✅ Connected to MongoDB successfully');
    }
    async onModuleDestroy() {
        await this.client?.close();
        console.log('❌ Disconnected from MongoDB');
    }
    getDb() {
        return this.db;
    }
    getCollection(name) {
        return this.db.collection(name);
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);
//# sourceMappingURL=database.service.js.map