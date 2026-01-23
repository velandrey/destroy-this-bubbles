import { RequestHandler, Request } from 'express';

// TODO сделать проверку auth-куки и uuid. Добавить cookie-parser для удобства проверки.
const hasAuthCookie = (request: Request): boolean => {
    if (!request.headers.cookie) {
        return false;
    }
    return true;
};

// TODO доработать проверку. При наличии куки направлять на yandex api для проверки корректности куки.
export const authMiddleware: RequestHandler = (req, res, next) => {
    if (!hasAuthCookie(req)) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    next();
};
