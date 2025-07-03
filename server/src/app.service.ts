import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Hotel Management API',
      version: '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString(),
    };
  }

  getHealth(): object {
    return {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'hotel-management-api'
    };
  }

  getApiInfo(): object {
    return {
      name: 'Hotel Management System API',
      description: 'RESTful API for hotel room booking and management',
      version: '1.0.0',
      endpoints: {
        '/': 'API Information',
        '/health': 'Health Check',
        '/info': 'API Details'
      }
    };
  }
}
