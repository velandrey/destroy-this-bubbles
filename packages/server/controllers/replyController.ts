import { Response } from 'express';

import { Reply } from '../models/Reply';
import { sanitizeInput } from '../utils/sanitize';

interface AuthRequest {
    userId?: number;
    body: {
        content?: string;
        commentId?: number;
        parentReplyId?: number | null;
    };
    params: {
        id?: string;
    };
}

export const createReply = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { content, commentId, parentReplyId } = req.body;

        if (!content || !commentId) {
            res.status(400).json({ error: 'Требуются текст и ID комментария' });
            return;
        }

        if (!req.userId) {
            res.status(403).json({ error: 'Неавторизован' });
            return;
        }

        const sanitizedContent = sanitizeInput(content);

        const reply = await Reply.create({
            content: sanitizedContent,
            commentId: Number(commentId),
            parentReplyId: parentReplyId ? Number(parentReplyId) : null,
            userId: req.userId,
        });

        res.status(201).json(reply);
    } catch (error) {
        console.error('Ошибка создания ответа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const getRepliesByComment = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID комментария' });
            return;
        }

        const replies = await Reply.findAll({
            where: { commentId: Number(id) },
            order: [['createdAt', 'ASC']],
        });

        res.json(replies);
    } catch (error) {
        console.error('Ошибка получения ответов:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const getReplyById = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID ответа' });
            return;
        }

        const reply = await Reply.findByPk(Number(id));

        if (!reply) {
            res.status(404).json({ error: 'Ответ не найден' });
            return;
        }

        res.json(reply);
    } catch (error) {
        console.error('Ошибка получения ответа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const updateReply = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID ответа' });
            return;
        }

        if (!req.userId) {
            res.status(403).json({ error: 'Неавторизован' });
            return;
        }

        if (!content) {
            res.status(400).json({ error: 'Требуется текст' });
            return;
        }

        const reply = await Reply.findByPk(Number(id));

        if (!reply) {
            res.status(404).json({ error: 'Ответ не найден' });
            return;
        }

        if (reply.userId !== req.userId) {
            res.status(403).json({
                error: 'Вы можете обновлять только свои ответы',
            });
            return;
        }

        reply.content = sanitizeInput(content);
        await reply.save();

        res.json(reply);
    } catch (error) {
        console.error('Ошибка обновления ответа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const deleteReply = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID ответа' });
            return;
        }

        if (!req.userId) {
            res.status(403).json({ error: 'Неавторизован' });
            return;
        }

        const reply = await Reply.findByPk(Number(id));

        if (!reply) {
            res.status(404).json({ error: 'Ответ не найден' });
            return;
        }

        if (reply.userId !== req.userId) {
            res.status(403).json({
                error: 'Вы можете удалять только свои ответы',
            });
            return;
        }

        await reply.destroy();

        res.status(204).send();
    } catch (error) {
        console.error('Ошибка удаления ответа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};
