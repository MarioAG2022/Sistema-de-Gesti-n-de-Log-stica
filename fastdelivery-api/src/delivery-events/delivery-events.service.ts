import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  DeliveryEvent,
  DeliveryEventDocument,
} from './schemas/delivery-event.schema';

@Injectable()
export class DeliveryEventsService {
  constructor(
    @InjectModel(DeliveryEvent.name)
    private deliveryEventModel: Model<DeliveryEventDocument>,
  ) {}

  async createEvent(data: {
    orderId: number;
    previousStatus?: string;
    newStatus: string;
    lat?: number;
    lng?: number;
    comment?: string;
  }) {
    return this.deliveryEventModel.create({
      orderId: data.orderId,
      previousStatus: data.previousStatus,
      newStatus: data.newStatus,
      location:
        data.lat && data.lng
          ? {
              lat: data.lat,
              lng: data.lng,
            }
          : undefined,
      comment: data.comment,
    });
  }

  async getOrderHistory(orderId: number) {
    return this.deliveryEventModel
      .find({ orderId })
      .sort({ createdAt: 1 })   // ascendente: más antiguo primero
      .lean()                    // IMPORTANTE: retorna POJOs, no Documents
                                 // sin .lean() los timestamps virtuales no se serializan
      .exec();
  }
}