import { prisma } from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { UpdateRoleInput } from './schemas';

function userSelect() {
  return {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true
  };
}

export async function listUsers() {
  return prisma.user.findMany({
    select: userSelect(),
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateRole(id: string, input: UpdateRoleInput) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return prisma.user.update({
    where: { id },
    data: { role: input.role },
    select: userSelect()
  });
}
