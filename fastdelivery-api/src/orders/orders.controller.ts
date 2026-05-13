import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('driver/:driverId')
  @ApiOperation({
    summary: 'Pedidos de un repartidor',
    description: 'Devuelve todos los pedidos asignados al repartidor indicado, incluyendo datos del cliente.',
  })
  @ApiParam({ name: 'driverId', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Lista de pedidos (puede ser vacía)' })
  @ApiResponse({ status: 401, description: 'No autorizado — JWT requerido' })
  findByDriver(@Param('driverId', ParseIntPipe) driverId: number) {
    return this.ordersService.findByDriver(driverId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Detalle de un pedido',
    description: 'Devuelve el pedido con cliente y repartidor. Lanza 404 si no existe.',
  })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado — JWT requerido' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Actualizar estado del pedido',
    description:
      'Cambia el estado en MySQL y registra un evento de trazabilidad en MongoDB. ' +
      'Estados válidos: PENDING, ON_ROUTE, DELIVERED, CANCELLED.',
  })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Estado actualizado y evento registrado' })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado — JWT requerido' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Get(':id/history')
  @ApiOperation({
    summary: 'Historial de eventos de un pedido',
    description: 'Devuelve el pedido (MySQL) más el historial completo de cambios de estado (MongoDB).',
  })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Pedido e historial de eventos' })
  @ApiResponse({ status: 401, description: 'No autorizado — JWT requerido' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  findHistory(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findHistory(id);
  }
}
