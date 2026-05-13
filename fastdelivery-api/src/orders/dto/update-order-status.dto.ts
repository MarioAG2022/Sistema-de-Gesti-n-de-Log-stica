import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.ON_ROUTE,
    description: 'Nuevo estado del pedido',
  })
  @IsEnum(OrderStatus)
  newStatus: OrderStatus;

  @ApiProperty({
    example: 25.6714,
    description: 'Latitud de la ubicación del repartidor',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({
    example: -100.3099,
    description: 'Longitud de la ubicación del repartidor',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiProperty({
    example: 'El cliente no estaba en casa',
    description: 'Comentario adicional sobre el cambio de estado',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
