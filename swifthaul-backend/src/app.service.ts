import { Injectable } from '@nestjs/common';
import { formatUptime } from '../helpers/app.helpers';

@Injectable()
export class AppService {
  getHealthCheck() {
    const uptimeSeconds = process.uptime();
    return {
      status: 'healthy',
      service: 'swiftHaul Backend server',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(uptimeSeconds),
      environment: process.env.NODE_ENV || 'development',
      message: 'SwiftHaul Backend server is running successfully',
    };
  }
}
