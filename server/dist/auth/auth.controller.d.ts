import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from './interfaces/user.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: Omit<import("./interfaces/user.interface").User, "password">;
        access_token: string;
        success: boolean;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Omit<import("./interfaces/user.interface").User, "password">;
        access_token: string;
        success: boolean;
        message: string;
    }>;
    getProfile(req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./interfaces/user.interface").User;
    }>;
    getMe(req: any): Promise<{
        _id?: import("bson").ObjectId;
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(): Promise<{
        success: boolean;
        message: string;
        data: {
            _id?: import("bson").ObjectId;
            email: string;
            firstName: string;
            lastName: string;
            role: UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
}
