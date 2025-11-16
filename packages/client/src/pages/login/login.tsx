import { Form } from '@components/form';
import { Page } from '@components/page';
import { Grid, Link } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LOGIN_INPUTS } from './constants';
import styles from './styles.module.scss';
import { signIn } from '@hooks/useLogin';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);
    const navigate = useNavigate();

    const handleSubmit = useCallback(
        async (data: Record<string, string | File | null>) => {
            setLoading(true);
            const payload = {
                login: (data.name as string) || '',
                password: (data.password as string) || '',
            };
            controllerRef.current = new AbortController();
            try {
                const responce = await signIn(payload, {
                    signal: controllerRef.current.signal,
                });
                if (responce === 'OK') {
                    localStorage.setItem('is_auth', 'true');
                    navigate('/profile');
                }
            } finally {
                setLoading(false);
            }
            return () => controllerRef.current?.abort();
        },
        []
    );

    const handleReset = useCallback(async () => {
        controllerRef.current?.abort();
    }, []);

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
                    onSubmit={handleSubmit}
                    onReset={handleReset}
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
