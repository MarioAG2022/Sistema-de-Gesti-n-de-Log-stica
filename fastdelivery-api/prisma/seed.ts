import { PrismaClient, UserRole, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  // ── Driver ───────────────────────────────────────────
  const driver = await prisma.user.upsert({
    where: { email: 'driver@test.com' },
    update: { name: 'Demo Driver' },
    create: {
      name: 'Demo Driver',
      email: 'driver@test.com',
      password,
      role: UserRole.DRIVER,
    },
  });

  // ── Clientes ─────────────────────────────────────────
  const customer1 = await prisma.customer.upsert({
    where: { id: 1 },
    update: {
      name: 'María González',
      email: 'maria.gonzalez@test.com',
      phone: '8441234567',
      address: 'Blvd. Venustiano Carranza 1234, Saltillo, Coahuila',
    },
    create: {
      name: 'María González',
      email: 'maria.gonzalez@test.com',
      phone: '8441234567',
      address: 'Blvd. Venustiano Carranza 1234, Saltillo, Coahuila',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 2 },
    update: {
      name: 'Carlos Ramírez',
      email: 'carlos.ramirez@test.com',
      phone: '8449876543',
      address: 'Av. Universidad 567, Monterrey, Nuevo León',
    },
    create: {
      name: 'Carlos Ramírez',
      email: 'carlos.ramirez@test.com',
      phone: '8449876543',
      address: 'Av. Universidad 567, Monterrey, Nuevo León',
    },
  });

  // ── Pedidos ──────────────────────────────────────────
  await prisma.order.upsert({
    where: { trackingId: 'FD-0001' },
    update: {
      address: customer1.address ?? '',
      status: OrderStatus.PENDING,
    },
    create: {
      trackingId: 'FD-0001',
      status: OrderStatus.PENDING,
      address: customer1.address ?? '',
      driverId: driver.id,
      customerId: customer1.id,
    },
  });

  await prisma.order.upsert({
    where: { trackingId: 'FD-0002' },
    update: {
      address: customer2.address ?? '',
      status: OrderStatus.ON_ROUTE,
    },
    create: {
      trackingId: 'FD-0002',
      status: OrderStatus.ON_ROUTE,
      address: customer2.address ?? '',
      driverId: driver.id,
      customerId: customer2.id,
    },
  });

  await prisma.order.upsert({
    where: { trackingId: 'FD-0003' },
    update: {
      address: 'Calle Hidalgo 890, Guadalajara, Jalisco',
      status: OrderStatus.PENDING,
    },
    create: {
      trackingId: 'FD-0003',
      status: OrderStatus.PENDING,
      address: 'Calle Hidalgo 890, Guadalajara, Jalisco',
      driverId: driver.id,
      customerId: customer1.id,
    },
  });

  console.log('✅ Seed ejecutado correctamente');
  console.log(`   Driver: ${driver.email}`);
  console.log(`   Pedidos: FD-0001, FD-0002, FD-0003`);
}

main()
  .catch((error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });