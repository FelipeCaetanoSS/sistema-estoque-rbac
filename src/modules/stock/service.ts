import { MovementType, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { MovementInput } from './schemas';

function toMovementResponse(
  movement: Prisma.MovementGetPayload<{ include: { product: true; user: true } }>
) {
  return {
    id: movement.id,
    type: movement.type,
    quantity: movement.quantity,
    createdAt: movement.createdAt,
    product: {
      id: movement.product.id,
      sku: movement.product.sku,
      name: movement.product.name
    },
    user: {
      id: movement.user.id,
      name: movement.user.name,
      email: movement.user.email
    }
  };
}

export async function getStock(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, sku: true, name: true, quantity: true }
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
}

export async function moveStock(
  productId: string,
  userId: string,
  type: MovementType,
  input: MovementInput
) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    if (type === MovementType.OUT && product.quantity < input.quantity) {
      throw new AppError(400, 'Insufficient stock');
    }

    const nextQuantity = type === MovementType.IN
      ? product.quantity + input.quantity
      : product.quantity - input.quantity;

    const movement = await tx.movement.create({
      data: {
        type,
        quantity: input.quantity,
        productId,
        userId
      },
      include: {
        product: true,
        user: true
      }
    });

    await tx.product.update({
      where: { id: productId },
      data: { quantity: nextQuantity }
    });

    return {
      movement: toMovementResponse(movement),
      stock: {
        productId,
        quantity: nextQuantity
      }
    };
  });
}

export async function listMovements() {
  const movements = await prisma.movement.findMany({
    include: {
      product: true,
      user: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return movements.map(toMovementResponse);
}
