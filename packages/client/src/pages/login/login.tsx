import { Form } from '@components/form';
import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { useAppDispatch } from '@hooks/redux';
import { useNotification } from '@hooks/useNotification';
import { useOAuth } from '@hooks/useOAuth';
import { useProfile } from '@hooks/useProfile';
import { Button, Grid, Link } from '@mui/material';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { signIn } from './api';
import { LOGIN_INPUTS, LOGIN_SCHEMA } from './constants';
import styles from './styles.module.scss';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const { showNotification, showError, showSuccess } = useNotification();
    const controllerRef = useRef<AbortController | null>(null);
    const navigate = useNavigate();
    const { getUserData } = useProfile();
    const { initiateOAuth, isLoading: isOAuthLoading } = useOAuth();

    const handleSubmit = async (data: Record<string, string | File | null>) => {
        showNotification('Выполняется вход...');
        const payload = {
            login: (data.login as string) || '',
            password: (data.password as string) || '',
        };
        controllerRef.current = new AbortController();
        try {
            const response = await signIn(payload, {
                signal: controllerRef.current.signal,
            });
            if (response === 'OK') {
                await getUserData();
                navigate(ROUTES.PROFILE);
                showSuccess('Успешная авторизация');
            }
        } catch (error) {
            showError('Ошибка авторизации');
        }
    };

    const handleReset = async () => {
        controllerRef.current?.abort();
    };

    const handleYandexLogin = () => {
        initiateOAuth();
    };

    return (
        <Page>
            <Grid container className={styles.login_box}>
                <h1>Авторизация</h1>
                <Form
                    submitBtnLabel="Войти"
                    inputs={LOGIN_INPUTS}
                    schema={LOGIN_SCHEMA}
                    submitHandler={handleSubmit}
                    resetHandler={handleReset}
                    className={styles.formContainer}
                />
                <Button
                    variant="outlined"
                    onClick={handleYandexLogin}
                    disabled={isOAuthLoading}
                    className={styles.oauthLink}
                >
                    {isOAuthLoading ? 'Загрузка...' : 'Войти через Яндекс'}
                </Button>
                <span className={styles.link}>
                    <span className={styles.link_title}>
                        Новый пользователь?
                    </span>
                    <Link href={ROUTES.REGISTRATION}>Зарегистрироваться</Link>
                </span>
            </Grid>
        </Page>
    );
};

export default LoginPage;
