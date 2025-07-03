"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongodb_1 = require("mongodb");
const bcrypt = require("bcrypt");
const database_service_1 = require("../database/database.service");
const user_interface_1 = require("./interfaces/user.interface");
let AuthService = class AuthService {
    databaseService;
    jwtService;
    constructor(databaseService, jwtService) {
        this.databaseService = databaseService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const usersCollection = this.databaseService.getCollection('users');
        const existingUser = await usersCollection.findOne({ email: registerDto.email });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
        const newUser = {
            email: registerDto.email,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            role: registerDto.role || user_interface_1.UserRole.CUSTOMER,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await usersCollection.insertOne(newUser);
        const createdUser = await usersCollection.findOne({ _id: result.insertedId });
        if (!createdUser) {
            throw new common_1.InternalServerErrorException('Failed to create user');
        }
        const payload = {
            sub: createdUser._id.toString(),
            email: createdUser.email,
            role: createdUser.role,
        };
        const access_token = this.jwtService.sign(payload);
        const { password, ...userWithoutPassword } = createdUser;
        return {
            user: userWithoutPassword,
            access_token,
        };
    }
    async login(loginDto) {
        const usersCollection = this.databaseService.getCollection('users');
        const user = await usersCollection.findOne({ email: loginDto.email });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        await usersCollection.updateOne({ _id: user._id }, { $set: { updatedAt: new Date() } });
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            access_token,
        };
    }
    async findUserById(userId) {
        const usersCollection = this.databaseService.getCollection('users');
        try {
            const user = await usersCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
            if (!user) {
                return null;
            }
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            return null;
        }
    }
    async validateUser(email, password) {
        const usersCollection = this.databaseService.getCollection('users');
        const user = await usersCollection.findOne({ email });
        if (!user || !user.isActive) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        const { password: userPassword, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async validateUserById(userId) {
        if (!mongodb_1.ObjectId.isValid(userId)) {
            return null;
        }
        const user = await this.databaseService.getCollection('users').findOne({ _id: new mongodb_1.ObjectId(userId), isActive: true });
        return user || null;
    }
    async findById(id) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Geçersiz kullanıcı ID formatı');
        }
        const user = await this.databaseService.getCollection('users').findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        return user;
    }
    async findAll() {
        return await this.databaseService.getCollection('users').find({}).sort({ createdAt: -1 }).toArray();
    }
    async findByEmail(email) {
        return await this.databaseService.getCollection('users').findOne({ email });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map