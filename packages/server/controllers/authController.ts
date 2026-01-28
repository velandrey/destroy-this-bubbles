import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

import { User } from '../models/User';
import { sanitizeInput } from '../utils/sanitize';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({
                error: 'Требуются имя пользователя, email и пароль',
            });
            return;
        }

        const sanitizedUsername = sanitizeInput(username);
        const sanitizedEmail = sanitizeInput(email);

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: sanitizedUsername },
                    { email: sanitizedEmail },
                ],
            },
        });

        if (existingUser) {
            res.status(409).json({
                error: 'Пользователь с таким именем или email уже существует',
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: sanitizedUsername,
            email: sanitizedEmail,
            password: hashedPassword,
        });

        const jwtSecret =
            process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const token = jwt.sign({ userId: user.id }, jwtSecret, {
            expiresIn: '24h',
        });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Требуются email и пароль' });
            return;
        }

        const sanitizedEmail = sanitizeInput(email);

        const user = await User.findOne({ where: { email: sanitizedEmail } });

        if (!user) {
            res.status(401).json({ error: 'Неверный email или пароль' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Неверный email или пароль' });
            return;
        }

        const jwtSecret =
            process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const token = jwt.sign({ userId: user.id }, jwtSecret, {
            expiresIn: '24h',
        });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};
