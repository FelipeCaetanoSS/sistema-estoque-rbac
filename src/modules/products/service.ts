import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { CreateProductInput, UpdateProductInput } from './schemas';

function toProductResponse(product: Prisma.ProductGetPayload<{ include: { category: true } }>) {
  return {
    ...product,
    price: Number(product.price)
  };
}

async function resolveCategory(input: { categoryId?: string; categoryName?: string }) {
  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });

    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    return category;
  }

  return prisma.category.upsert({
    where: { name: input.categoryName },
    update: {},
    create: { name: input.categoryName as string }
  });
}

export async function listProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  return products.map(toProductResponse);
}

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return toProductResponse(product);
}

export async function createProduct(input: CreateProductInput) {
  const category = await resolveCategory(input);

  const product = await prisma.product.create({
    data: {
      sku: input.sku,
      name: input.name,
      price: input.price,
      quantity: input.quantity,
      categoryId: category.id
    },
    include: { category: true }
  });

  return toProductResponse(product);
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  await getProduct(id);

  const category = input.categoryId || input.categoryName
    ? await resolveCategory(input)
    : undefined;

  const product = await prisma.product.update({
    where: { id },
    data: {
      sku: input.sku,
      name: input.name,
      price: input.price,
      categoryId: category?.id
    },
    include: { category: true }
  });

  return toProductResponse(product);
}

export async function deleteProduct(id: string) {
  await getProduct(id);
  await prisma.product.delete({ where: { id } });
}
