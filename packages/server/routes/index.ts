import { Router } from 'express';

// import * as authController from '../controllers/authController';
import * as commentController from '../controllers/commentController';
import * as reactionController from '../controllers/reactionController';
import * as replyController from '../controllers/replyController';
import * as topicController from '../controllers/topicController';
import { requireAuth } from '../middleware/auth';

export const router = Router();

// Пока убрал наши ручки аутентификации, т.к. сейчас весь клиент завязан на API Яндекса
// Поэтому пока все запросы с клиента на ../api/auth ../api/user и т.п. проксируются на внешний API
// router.post('/auth/register', authController.register);
// router.post('/auth/login', authController.login);

router.post('/topics', requireAuth, topicController.createTopic);
router.get('/topics', topicController.getAllTopics);
router.put('/topics/:id', requireAuth, topicController.updateTopic);
router.delete('/topics/:id', requireAuth, topicController.deleteTopic);

// Комментарии
router.post('/comments', requireAuth, commentController.createComment);
router.get('/topics/:id/comments', commentController.getCommentsByTopic);
router.put('/comments/:id', requireAuth, commentController.updateComment);
router.delete('/comments/:id', requireAuth, commentController.deleteComment);

// Ответы на комментарии
router.post('/replies', requireAuth, replyController.createReply);
router.get('/comments/:id/replies', replyController.getRepliesByComment);
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
