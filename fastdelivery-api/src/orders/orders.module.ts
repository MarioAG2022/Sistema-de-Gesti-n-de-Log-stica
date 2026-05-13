import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DeliveryEventsModule } from '../delivery-events/delivery-events.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, DeliveryEventsModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
