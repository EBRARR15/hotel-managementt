import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { Roles } from './common/decorators/roles.decorator';
import { UserRole } from './auth/interfaces/user.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Hotel Booking API',
      version: '1.0.0',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected() {
    return {
      message: 'This is a protected route - you are authenticated!',
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  getAdminOnly() {
    return {
      message: 'This route is only for admins!',
      timestamp: new Date().toISOString(),
    };
  }
}
