import { PrismaClient, UserRole, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const driver = await prisma.user.upsert({
    where: { email: 'driver@test.com' },
    update: {},
    create: {
      name: 'Demo Driver',
      email: 'driver@test.com',
      password,
      role: UserRole.DRIVER,
    },
  });

  const customer = await prisma.customer.create({
    data: {
      name: 'Cliente Demo',
      phone: '8441234567',
      address: 'Saltillo, Coahuila',
    },
  });

  await prisma.order.create({
    data: {
      trackingId: 'FD-0001',
      status: OrderStatus.PENDING,
      driverId: driver.id,
      customerId: customer.id,
    },
  });

  console.log('Seed ejecutado correctamente');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });