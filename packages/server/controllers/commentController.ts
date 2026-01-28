import { Response } from 'express';

import { Comment } from '../models/Comment';
import { sanitizeInput } from '../utils/sanitize';

interface AuthRequest {
    userId?: number;
    body: {
        content?: string;
        topicId?: number;
        parentId?: number | null;
    };
    params: {
        id?: string;
    };
}

export const createComment = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { content, topicId, parentId } = req.body;

        if (!content || !topicId) {
            res.status(400).json({ error: 'Требуются текст и ID темы' });
            return;
        }

        if (!req.userId) {
            res.status(403).json({ error: 'Неавторизован' });
            return;
        }

        const sanitizedContent = sanitizeInput(content);

        const comment = await Comment.create({
            content: sanitizedContent,
            topicId: Number(topicId),
            parentId: parentId ? Number(parentId) : null,
            userId: req.userId,
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Ошибка создания комментария:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const getCommentsByTopic = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID темы' });
            return;
        }

        const comments = await Comment.findAll({
            where: { topicId: Number(id) },
            order: [['createdAt', 'ASC']],
        });

        res.json(comments);
    } catch (error) {
        console.error('Ошибка получения комментариев:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const updateComment = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID комментария' });
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

        const comment = await Comment.findByPk(Number(id));

        if (!comment) {
            res.status(404).json({ error: 'Комментарий не найден' });
            return;
        }

        if (comment.userId !== req.userId) {
            res.status(403).json({
                error: 'Вы можете обновлять только свои комментарии',
            });
            return;
        }

        comment.content = sanitizeInput(content);
        await comment.save();

        res.json(comment);
    } catch (error) {
        console.error('Ошибка обновления комментария:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const deleteComment = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID комментария' });
            return;
        }

        if (!req.userId) {
            res.status(403).json({ error: 'Неавторизован' });
            return;
        }

        const comment = await Comment.findByPk(Number(id));

        if (!comment) {
            res.status(404).json({ error: 'Комментарий не найден' });
            return;
        }

        if (comment.userId !== req.userId) {
            res.status(403).json({
                error: 'Вы можете удалять только свои комментарии',
            });
            return;
        }

        await comment.destroy();

        res.status(204).send();
    } catch (error) {
        console.error('Ошибка удаления комментария:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};
