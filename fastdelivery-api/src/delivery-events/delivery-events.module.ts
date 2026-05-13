import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeliveryEvent,
  DeliveryEventSchema,
} from './schemas/delivery-event.schema';
import { DeliveryEventsService } from './delivery-events.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryEvent.name, schema: DeliveryEventSchema },
    ]),
  ],
  providers: [DeliveryEventsService],
  exports: [DeliveryEventsService],
})
export class DeliveryEventsModule {}