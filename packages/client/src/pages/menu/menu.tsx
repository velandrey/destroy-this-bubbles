import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { useOAuth } from '@hooks/useOAuth';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    GameTitle,
    GameDescription,
    GameRules,
    GameGoal,
    PlayText,
} from './constants';
import styles from './styles.module.scss';

const MenuPage = () => {
    const navigate = useNavigate();
    const { handleOAuthCallback } = useOAuth();

    // Эффект на случай OAuth авторизации - проверяем code в URL при загрузке компонента
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            handleOAuthCallback(code);
            // Очищаем URL от code параметра
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            window.history.replaceState({}, document.title, url.toString());
        }
    }, []);

    return (
        <Page className={styles.container}>
            <article className={styles.content}>
                <h1>{GameTitle}</h1>
                <p className={styles.discription}>{GameDescription}</p>
                <p className={styles.discription}>{GameRules}</p>
                <p className={styles.discription}>{GameGoal}</p>
            </article>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(ROUTES.GAME)}
                className={styles.playButton}
            >
                {PlayText}
            </Button>
        </Page>
    );
};

export default MenuPage;
