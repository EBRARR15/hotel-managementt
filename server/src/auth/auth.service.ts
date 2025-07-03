import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { User, UserRole, UserPayload } from './interfaces/user.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Omit<User, 'password'>; access_token: string }> {
    const usersCollection = this.databaseService.getCollection<User>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create new user
    const newUser: Omit<User, '_id'> = {
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role || UserRole.CUSTOMER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    const createdUser = await usersCollection.findOne({ _id: result.insertedId });

    if (!createdUser) {
      throw new InternalServerErrorException('Failed to create user');
    }

    // Generate JWT token
    const payload: UserPayload = {
      sub: createdUser._id.toString(),
      email: createdUser.email,
      role: createdUser.role,
    };

    const access_token = this.jwtService.sign(payload);

    // Remove password from response
    const { password, ...userWithoutPassword } = createdUser;
    
    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password'>; access_token: string }> {
    const usersCollection = this.databaseService.getCollection<User>('users');

    // Find user by email
    const user = await usersCollection.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload: UserPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { updatedAt: new Date() } }
    );

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  async findUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const usersCollection = this.databaseService.getCollection<User>('users');
    
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return null;
      }
      
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const usersCollection = this.databaseService.getCollection<User>('users');
    
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

  // Kullanıcı doğrulama (JWT için userId ile)
  async validateUserById(userId: string): Promise<User | null> {
    if (!ObjectId.isValid(userId)) {
      return null;
    }

    const user = await this.databaseService.getCollection<User>('users').findOne({ _id: new ObjectId(userId), isActive: true });
    return user || null;
  }

  // ID ile kullanıcı bulma
  async findById(id: string): Promise<User> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Geçersiz kullanıcı ID formatı');
    }

    const user = await this.databaseService.getCollection<User>('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return user;
  }

  // Tüm kullanıcıları getir (Admin için)
  async findAll(): Promise<User[]> {
    return await this.databaseService.getCollection<User>('users').find({}).sort({ createdAt: -1 }).toArray();
  }

  // E-posta ile kullanıcı bulma
  async findByEmail(email: string): Promise<User | null> {
    return await this.databaseService.getCollection<User>('users').findOne({ email });
  }
} 