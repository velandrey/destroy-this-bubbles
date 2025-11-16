import { Page } from '@components/page';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

type TErrorPageProps = {
    errorCode?: number;
};

type TErrorContent = {
    title: string;
    message: string;
};

type TErrorCode = 400 | 401 | 403 | 404 | 500 | 502 | 503;

const ERROR_CONTENT: Record<TErrorCode | 'default', TErrorContent> = {
    400: {
        title: 'Неверный запрос',
        message: 'Сервер не может обработать ваш запрос.',
    },
    401: {
        title: 'Не авторизован',
        message: 'Для доступа к этой странице требуется авторизация.',
    },
    403: {
        title: 'Доступ запрещен',
        message: 'У вас нет прав для доступа к этой странице.',
    },
    404: {
        title: 'Страница не найдена',
        message: 'Запрашиваемая страница не существует или была перемещена.',
    },
    500: {
        title: 'Внутренняя ошибка сервера',
        message:
            'Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже.',
    },
    502: {
        title: 'Плохой шлюз',
        message: 'Сервер получил неверный ответ от вышестоящего сервера.',
    },
    503: {
        title: 'Сервис недоступен',
        message: 'Сервер временно недоступен. Пожалуйста, попробуйте позже.',
    },
    default: {
        title: 'Произошла ошибка',
        message: 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.',
    },
};

const getErrorContent = (errorCode: number) => {
    return ERROR_CONTENT[errorCode as TErrorCode] || ERROR_CONTENT.default;
};

const ErrorPage: React.FC<TErrorPageProps> = ({
    errorCode = 500,
}: TErrorPageProps) => {
    const navigate = useNavigate();
    const errorContent = getErrorContent(errorCode);
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
