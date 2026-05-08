import {
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface TrackingLocationEvent {
  referenceId: string;
  trackingToken: string;
  driverId: string;
  lat: number;
  lng: number;
  speed: number | null;
  heading: number | null;
  locationUpdatedAt: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'tracking',
})
export class TrackingGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnModuleDestroy
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(TrackingGateway.name);

  onModuleInit() {
    this.logger.log('Tracking gateway initialized');
  }

  onModuleDestroy() {
    this.logger.log('Tracking gateway destroyed');
  }

  handleConnection(client: Socket) {
    const trackingToken = this.getQueryValue(client, 'trackingToken');
    const referenceId = this.getQueryValue(client, 'referenceId');

    if (trackingToken) {
      void client.join(`track:${trackingToken}`);
    }

    if (referenceId) {
      void client.join(`order:${referenceId}`);
    }

    this.logger.log(
      `Tracking socket connected ${client.id} token=${trackingToken ?? '-'} reference=${referenceId ?? '-'}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Tracking socket disconnected ${client.id}`);
  }

  emitLocationUpdate(event: TrackingLocationEvent) {
    this.server
      .to(`track:${event.trackingToken}`)
      .emit('tracking:location', event);
    this.server
      .to(`order:${event.referenceId}`)
      .emit('tracking:location', event);
  }

  private getQueryValue(client: Socket, key: string): string | undefined {
    const value = client.handshake.query[key];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }
}
