import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';

type JwtPayload = {
  sub: string;
  role: Role;
};

export function signToken(user: { id: string; role: Role }) {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn']
  };

  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    ...options,
    subject: user.id
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
