import { Router } from 'express';

import { getThemeByUserId, upsertUserTheme } from '../db';

const router = Router();

router.get('/:user_id', async (req, res) => {
    const userId = Number(req.params.user_id);
    if (!Number.isInteger(userId)) {
        res.status(400).json({ error: 'user_id must be an integer' });
        return;
    }

    try {
        const theme = await getThemeByUserId(userId);
        res.status(200).json({ theme });
    } catch (error) {
        console.error('GET /my-api/v1/theme/:user_id failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    const { user_id, theme_id } = req.body ?? {};
    const userId = Number(user_id);
    const themeId = Number(theme_id);

    if (!Number.isInteger(userId) || !Number.isInteger(themeId)) {
        res.status(400).json({
            error: 'user_id and theme_id must be integers',
        });
        return;
    }

    try {
        await upsertUserTheme(userId, themeId);
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('POST /my-api/v1/theme failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
