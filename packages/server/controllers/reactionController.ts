import { Response } from 'express';

import { Reaction, ReactionType } from '../models/Reaction';

interface AuthRequest {
    userId?: number;
    body: {
        type?: ReactionType;
        commentId?: number;
    };
    params: {
        id?: string;
    };
}

export const createOrUpdateReaction = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { type, commentId } = req.body;

        if (!type || !commentId) {
            res.status(400).json({
                error: 'Требуются тип реакции и ID комментария',
            });
            return;
        }

        if (!req.userId) {
            res.status(403).json({ error: 'Неавторизован' });
            return;
        }

        const validTypes: ReactionType[] = [
            'like',
            'dislike',
            'love',
            'angry',
            'laugh',
        ];
        if (!validTypes.includes(type)) {
            res.status(400).json({ error: 'Недопустимый тип реакции' });
            return;
        }

        let reaction = await Reaction.findOne({
            where: {
                userId: req.userId,
                commentId: Number(commentId),
            },
        });

        if (reaction) {
            reaction.type = type;
            await reaction.save();
        } else {
            reaction = await Reaction.create({
                type,
                commentId: Number(commentId),
                userId: req.userId,
            });
        }

        res.status(201).json(reaction);
    } catch (error) {
        console.error('Ошибка создания реакции:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const getReactionsByComment = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID комментария' });
            return;
        }

        const reactions = await Reaction.findAll({
            where: { commentId: Number(id) },
            order: [['createdAt', 'DESC']],
        });

        res.json(reactions);
    } catch (error) {
        console.error('Ошибка получения реакций:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

export const deleteReaction = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Требуется ID реакции' });
            return;
        }

        if (!req.userId) {
            res.status(403).json({ error: 'Неавторизован' });
            return;
        }

        const reaction = await Reaction.findByPk(Number(id));

        if (!reaction) {
            res.status(404).json({ error: 'Реакция не найдена' });
            return;
        }

        if (reaction.userId !== req.userId) {
            res.status(403).json({
                error: 'Вы можете удалять только свои реакции',
            });
            return;
        }

        await reaction.destroy();

        res.status(204).send();
    } catch (error) {
        console.error('Ошибка удаления реакции:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};
