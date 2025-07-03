import { ObjectId } from 'mongodb';
export declare enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin"
}
export interface User {
    _id?: ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserPayload {
    sub: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}
