import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    userId?: number;
}

interface JwtPayload {
    userId: number;
}

export const requireAuth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(403).json({ error: 'Неавторизован. Требуется токен.' });
            return;
        }

        const token = authHeader.substring(7);
        const jwtSecret =
            process.env.JWT_SECRET || 'your-secret-key-change-in-production';

        try {
            const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
            req.userId = decoded.userId;
            next();
        } catch (error) {
            res.status(403).json({ error: 'Неавторизован. Неверный токен.' });
        }
    } catch (error) {
        res.status(403).json({ error: 'Неавторизован.' });
    }
};
