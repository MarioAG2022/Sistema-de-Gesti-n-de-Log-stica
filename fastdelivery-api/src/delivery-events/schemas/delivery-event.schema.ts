import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeliveryEventDocument = HydratedDocument<DeliveryEvent>;

@Schema({ timestamps: true })
export class DeliveryEvent {
  @Prop({ required: true })
  orderId: number;

  @Prop()
  previousStatus?: string;

  @Prop({ required: true })
  newStatus: string;

  @Prop({
    type: {
      lat: Number,
      lng: Number,
    },
  })
  location?: {
    lat: number;
    lng: number;
  };

  @Prop()
  comment?: string;
}

export const DeliveryEventSchema = SchemaFactory.createForClass(DeliveryEvent);