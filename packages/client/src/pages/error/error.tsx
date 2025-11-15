import { Page } from '@components/page';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

type TErrorPageProps = {
    errorCode?: number;
};

const ErrorPage: React.FC<TErrorPageProps> = ({ errorCode = 500 }) => {
    const navigate = useNavigate();

    const getErrorContent = () => {
        switch (errorCode) {
            case 400:
                return {
                    title: 'Неверный запрос',
                    message: 'Сервер не может обработать ваш запрос.',
                };
            case 401:
                return {
                    title: 'Не авторизован',
                    message:
                        'Для доступа к этой странице требуется авторизация.',
                };
            case 403:
                return {
                    title: 'Доступ запрещен',
                    message: 'У вас нет прав для доступа к этой странице.',
                };
            case 404:
                return {
                    title: 'Страница не найдена',
                    message:
                        'Запрашиваемая страница не существует или была перемещена.',
                };
            case 500:
                return {
                    title: 'Внутренняя ошибка сервера',
                    message:
                        'Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже.',
                };
            case 502:
                return {
                    title: 'Плохой шлюз',
                    message:
                        'Сервер получил неверный ответ от вышестоящего сервера.',
                };
            case 503:
                return {
                    title: 'Сервис недоступен',
                    message:
                        'Сервер временно недоступен. Пожалуйста, попробуйте позже.',
                };
            default:
                return {
                    title: 'Произошла ошибка',
                    message:
                        'Что-то пошло не так. Пожалуйста, попробуйте еще раз.',
                };
        }
    };

    const errorContent = getErrorContent();
    const displayTitle = errorContent.title;
    const displayMessage = errorContent.message;

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Page>
            <Container component="main" maxWidth="md">
                <Box className={styles.error__box}>
                    <Paper elevation={3} className={styles.error__paper}>
                        <Typography
                            variant="h3"
                            component="h3"
                            color="primary"
                            className={styles.error__code}
                        >
                            {errorCode}
                        </Typography>

                        <Typography variant="h4" component="h1">
                            {displayTitle}
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            className={styles.error__message}
                        >
                            {displayMessage}
                        </Typography>

                        <Box className={styles.error__action}>
                            <Button variant="contained" onClick={handleGoHome}>
                                На главную
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Page>
    );
};

export default ErrorPage;
