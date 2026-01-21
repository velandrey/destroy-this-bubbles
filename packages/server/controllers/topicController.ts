import { Response } from 'express';

import { Topic } from '../models/Topic';
import { sanitizeInput } from '../utils/sanitize';

interface AuthRequest {
    userId?: number;
    body: {
        title?: string;
        content?: string;
    };
    params: {
        id?: string;
    };
}

export const createTopic = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            res.status(400).json({ error: 'Требуются заголовок и содержимое' });
            return;
        }

        if (!req.userId) {
            res.status(403).json({ error: 'Неавторизован' });
            return;
        }

        const sanitizedTitle = sanitizeInput(title);
        const sanitizedContent = sanitizeInput(content);

        const topic = await Topic.create({
            title: sanitizedTitle,
            content: sanitizedContent,
            userId: req.userId,
        });

        res.status(201).json(topic);
    } catch (error) {
        console.error('Ошибка создания темы:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const getAllTopics = async (
    _req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const topics = await Topic.findAll({
            order: [['createdAt', 'DESC']],
        });

        res.json(topics);
    } catch (error) {
        console.error('Ошибка получения тем:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const getTopicById = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID темы' });
            return;
        }

        const topic = await Topic.findByPk(Number(id));

        if (!topic) {
            res.status(404).json({ error: 'Тема не найдена' });
            return;
        }

        res.json(topic);
    } catch (error) {
        console.error('Ошибка получения темы:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const updateTopic = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID темы' });
            return;
        }

        if (!req.userId) {
            res.status(403).json({ error: 'Неавторизован' });
            return;
        }

        const topic = await Topic.findByPk(Number(id));

        if (!topic) {
            res.status(404).json({ error: 'Тема не найдена' });
            return;
        }

        if (topic.userId !== req.userId) {
            res.status(403).json({
                error: 'Вы можете обновлять только свои темы',
            });
            return;
        }

        if (title) {
            topic.title = sanitizeInput(title);
        }
        if (content) {
            topic.content = sanitizeInput(content);
        }

        await topic.save();

        res.json(topic);
    } catch (error) {
        console.error('Ошибка обновления темы:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const deleteTopic = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID темы' });
            return;
        }

        if (!req.userId) {
            res.status(403).json({ error: 'Неавторизован' });
            return;
        }

        const topic = await Topic.findByPk(Number(id));

        if (!topic) {
            res.status(404).json({ error: 'Тема не найдена' });
            return;
        }

        if (topic.userId !== req.userId) {
            res.status(403).json({
                error: 'Вы можете удалять только свои темы',
            });
            return;
        }

        await topic.destroy();

        res.status(204).send();
    } catch (error) {
        console.error('Ошибка удаления темы:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};
