import { Form } from '@components/form';
import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { useAppDispatch } from '@hooks/redux';
import { useLoading } from '@hooks/useLoading';
import { useNotification } from '@hooks/useNotification';
import { useProfile } from '@hooks/useProfile';
import { Grid, Link } from '@mui/material';
import { setUser } from '@store/slices/userSlice';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { signIn } from './api';
import { LOGIN_INPUTS, LOGIN_SCHEMA } from './constants';
import styles from './styles.module.scss';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const { showError } = useNotification();
    const { startLoading, stopLoading } = useLoading();
    const controllerRef = useRef<AbortController | null>(null);
    const navigate = useNavigate();
    const { getUserData } = useProfile();

    const handleSubmit = async (data: Record<string, string | File | null>) => {
        startLoading('Выполняется вход...');
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
                const userData = await getUserData();
                dispatch(setUser(userData));
                navigate('/profile');
            }
        } catch (error) {
            showError('Ошибка авторизации');
        } finally {
            stopLoading();
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
