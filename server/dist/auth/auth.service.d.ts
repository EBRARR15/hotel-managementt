import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { User } from './interfaces/user.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly databaseService;
    private readonly jwtService;
    constructor(databaseService: DatabaseService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: Omit<User, 'password'>;
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Omit<User, 'password'>;
        access_token: string;
    }>;
    findUserById(userId: string): Promise<Omit<User, 'password'> | null>;
    validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null>;
    validateUserById(userId: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
}
