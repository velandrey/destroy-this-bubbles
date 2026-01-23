import type { RequestHandler, Request } from 'express';

import { ApiURL } from '../constants';

const hasAuthCookie = (request: Request): boolean => {
    if (!request.cookies) {
        return false;
    }

    const { authCookie, uuid } = request.cookies ?? {};

    return Boolean(authCookie && uuid);
};

export const authMiddleware: RequestHandler = async (req, res, next) => {
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

        return next();
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Auth service is not available' });
    }
};
