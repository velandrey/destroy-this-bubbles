import type { RequestHandler, Request } from 'express';

import { ApiURL } from '../constants';

interface IUserData {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string;
    phone: string;
    login: string;
    avatar: string;
    email: string;
}

export interface IAuthenticatedRequest extends Request {
    userId?: number;
    user?: IUserData;
}

const hasAuthCookie = (request: Request): boolean => {
    if (!request.cookies) {
        return false;
    }

    const { authCookie, uuid } = request.cookies ?? {};

    return Boolean(authCookie && uuid);
};

export const requireAuth: RequestHandler = async (req, res, next) => {
    if (!hasAuthCookie(req)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const cookieHeader = Object.entries(req.cookies ?? {})
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');

    try {
        const response = await fetch(`${ApiURL}/auth/user`, {
            method: 'GET',
            headers: {
                cookie: cookieHeader,
                accept: 'application/json',
            },
        });

        if (!response.ok) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = (await response.json()) as IUserData;

        if (user) {
            (req as IAuthenticatedRequest).userId = user.id;
            (req as IAuthenticatedRequest).user = user;
        }

        return next();
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Auth service is not available' });
    }
};
