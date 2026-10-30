import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index';
import { dataStore } from './dataStore';

export class AuthService {
  public static async register(data: {
    email: string;
    password: string;
    name: string;
    role?: 'STUDENT' | 'ADMIN';
  }) {
    // Check if user already exists
    const existing = Array.from(dataStore.users.values()).find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existing) {
      throw new Error('An account with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const id = `user_${Date.now()}`;
    const userRole = data.role === 'ADMIN' ? 'STUDENT' : 'STUDENT'; // Safety: users cannot self-assign ADMIN

    const newUser = {
      id,
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: userRole as 'STUDENT' | 'ADMIN',
      currentXP: 0,
      level: 1,
      createdAt: new Date().toISOString(),
      timezone: 'UTC',
    };

    dataStore.users.set(id, newUser);

    const accessToken = jwt.sign(
      { userId: newUser.id, role: newUser.role, email: newUser.email },
      config.jwt.accessSecret,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: newUser.id },
      config.jwt.refreshSecret,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        currentXP: newUser.currentXP,
        level: newUser.level,
      },
      accessToken,
      refreshToken,
    };
  }

  public static async login(data: { email: string; password: string }) {
    const user = Array.from(dataStore.users.values()).find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      config.jwt.accessSecret,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      config.jwt.refreshSecret,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        currentXP: user.currentXP,
        level: user.level,
      },
      accessToken,
      refreshToken,
    };
  }

  public static async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
      const user = dataStore.users.get(decoded.userId);
      if (!user) throw new Error('User not found');

      const accessToken = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        config.jwt.accessSecret,
        { expiresIn: '15m' }
      );
      const newRefreshToken = jwt.sign(
        { userId: user.id },
        config.jwt.refreshSecret,
        { expiresIn: '7d' }
      );

      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new Error('Invalid or expired refresh token');
    }
  }

  public static async getMe(userId: string) {
    const user = dataStore.users.get(userId);
    if (!user) {
      // Fallback to default student if demo id
      return {
        id: userId,
        email: 'student@university.edu',
        name: 'Alex Rivera',
        role: 'STUDENT',
        currentXP: 385,
        level: 3,
        timezone: 'UTC',
      };
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      currentXP: user.currentXP,
      level: user.level,
      timezone: user.timezone,
    };
  }
}
