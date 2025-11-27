import { Form } from '@components/form';
import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { useAppDispatch } from '@hooks/redux';
import { useNotification } from '@hooks/useNotification';
import { useProfile } from '@hooks/useProfile';
import { Grid, Link } from '@mui/material';
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
            }
        } catch (error) {
            showError('Ошибка авторизации');
        } finally {
            showSuccess('Успешная авторизация');
        }
    };

    const handleReset = async () => {
        controllerRef.current?.abort();
    };

    return (
        <Page>
            <Grid
                container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <h1>Авторизация</h1>
                <Form
                    submitBtnLabel="Войти"
                    inputs={LOGIN_INPUTS}
                    schema={LOGIN_SCHEMA}
                    submitHandler={handleSubmit}
                    resetHandler={handleReset}
                    className={styles.formContainer}
                />
                <span className={styles.link}>
                    Новый пользователь?
                    <Link href="/registration">Зарегистрироваться</Link>
                </span>
            </Grid>
        </Page>
    );
};

export default LoginPage;
