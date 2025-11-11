import { Page } from '@components/page';
import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

const MenuPage = () => {
    const navigate = useNavigate();

    return (
        <Page className={styles.container}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/game')}
            >
                Игра
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/profile')}
            >
                Профиль
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/leaderBoard')}
            >
                Таблица лидеров
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/forum')}
            >
                Форум
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/error')}
            >
                Ошибка
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
            >
                Выход
            </Button>
        </Page>
    );
};

export default MenuPage;
