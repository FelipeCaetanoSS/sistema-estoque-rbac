import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@estoque.local' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@estoque.local',
      passwordHash,
      role: Role.ADMIN
    }
  });

  await prisma.user.upsert({
    where: { email: 'editor@estoque.local' },
    update: {},
    create: {
      name: 'Editor',
      email: 'editor@estoque.local',
      passwordHash,
      role: Role.EDITOR
    }
  });

  await prisma.user.upsert({
    where: { email: 'user@estoque.local' },
    update: {},
    create: {
      name: 'Usuario',
      email: 'user@estoque.local',
      passwordHash,
      role: Role.USER
    }
  });

  const category = await prisma.category.upsert({
    where: { name: 'Geral' },
    update: {},
    create: { name: 'Geral' }
  });

  await prisma.product.upsert({
    where: { sku: 'SKU-001' },
    update: {},
    create: {
      sku: 'SKU-001',
      name: 'Produto de exemplo',
      price: 99.9,
      quantity: 10,
      categoryId: category.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
