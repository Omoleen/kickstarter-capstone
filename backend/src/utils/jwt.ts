import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT secret not configured');
  }
  
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
};
