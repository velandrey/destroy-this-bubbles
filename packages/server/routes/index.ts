import { Router } from 'express';

import * as authController from '../controllers/authController';
import * as commentController from '../controllers/commentController';
import * as reactionController from '../controllers/reactionController';
import * as replyController from '../controllers/replyController';
import * as topicController from '../controllers/topicController';
import { requireAuth } from '../middleware/auth';

export const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Защищенные роуты (требуется авторизация)
// Топики
router.post('/topics', requireAuth, topicController.createTopic);
router.get('/topics', topicController.getAllTopics); // Можно сделать публичным для чтения
router.get('/topics/:id', topicController.getTopicById);
router.put('/topics/:id', requireAuth, topicController.updateTopic);
router.delete('/topics/:id', requireAuth, topicController.deleteTopic);

// Комментарии
router.post('/comments', requireAuth, commentController.createComment);
router.get('/topics/:id/comments', commentController.getCommentsByTopic);
router.get('/comments/:id', commentController.getCommentById);
router.put('/comments/:id', requireAuth, commentController.updateComment);
router.delete('/comments/:id', requireAuth, commentController.deleteComment);

// Ответы на комментарии
router.post('/replies', requireAuth, replyController.createReply);
router.get('/comments/:id/replies', replyController.getRepliesByComment);
router.get('/replies/:id', replyController.getReplyById);
router.put('/replies/:id', requireAuth, replyController.updateReply);
router.delete('/replies/:id', requireAuth, replyController.deleteReply);

// Реакции
router.post(
    '/reactions',
    requireAuth,
    reactionController.createOrUpdateReaction
);
router.get('/comments/:id/reactions', reactionController.getReactionsByComment);
router.delete('/reactions/:id', requireAuth, reactionController.deleteReaction);

router.get('/sync/', reactionController.deleteReaction);
