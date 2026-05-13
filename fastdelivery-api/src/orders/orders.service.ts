import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryEventsService } from '../delivery-events/delivery-events.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly deliveryEventsService: DeliveryEventsService,
  ) {}

  /**
   * Lista los pedidos asignados a un repartidor incluyendo datos del cliente.
   */
  async findByDriver(driverId: number) {
    return this.prisma.order.findMany({
      where: { driverId },
      include: {
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Devuelve el detalle de un pedido incluyendo cliente y repartidor.
   * Lanza NotFoundException si no existe.
   */
  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        driver: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Pedido #${id} no encontrado`);
    }

    return order;
  }

  /**
   * Actualiza el estado del pedido en MySQL y persiste el evento en MongoDB.
   * Devuelve el pedido actualizado.
   */
  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Pedido #${id} no encontrado`);
    }

    const previousStatus = order.status;

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: dto.newStatus },
      include: { customer: true },
    });

    await this.deliveryEventsService.createEvent({
      orderId: id,
      previousStatus,
      newStatus: dto.newStatus,
      lat: dto.lat,
      lng: dto.lng,
      comment: dto.comment,
    });

    return updated;
  }

  /**
   * Devuelve el pedido desde MySQL junto con el historial de eventos desde MongoDB.
   */
  async findHistory(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!order) {
      throw new NotFoundException(`Pedido #${id} no encontrado`);
    }

    const history = await this.deliveryEventsService.getOrderHistory(id);

    return { order, history };
  }
}
