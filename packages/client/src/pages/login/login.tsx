import { Form } from '@components/form';
import { Page } from '@components/page';
import { Grid, Link } from '@mui/material';
import { useCallback, useRef, useState } from 'react';

import { LOGIN_INPUTS } from './constants';
import styles from './styles.module.scss';

import { signIn } from './api';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const handleSubmit = useCallback(
        async (data: Record<string, string | File | null>) => {
            setError(null);
            setLoading(true);

            const payload = {
                login: (data.name as string) || '',
                password: (data.password as string) || '',
            };

            controllerRef.current = new AbortController();
            try {
                const { status, body } = await signIn(payload, {
                    signal: controllerRef.current.signal,
                });

                if (status >= 200 && status < 300) {
                    localStorage.setItem('is_auth', 'true');
                } else if (status === 401) {
                    setError('Неверный логин или пароль');
                } else {
                    let body_message = null;
                    if (body !== null && typeof body === 'object') {
                        body_message =
                            body?.message || `Ошибка сервера (${status})`;
                    }
                    setError(body_message);
                }
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    setError('Запрос отменён');
                } else if (err instanceof Error) {
                    setError(err.message || 'Сетевая ошибка');
                } else {
                    setError(String(err) || 'Сетевая ошибка');
                }
            } finally {
                setLoading(false);
            }

            return () => controllerRef.current?.abort();
        },
        []
    );

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
