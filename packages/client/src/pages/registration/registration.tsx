import { Form } from '@components/form';
import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { useNotification } from '@hooks/useNotification';
import { useProfile } from '@hooks/useProfile';
import { Grid, Link } from '@mui/material';
import { ApiError } from '@utils/fetchApi';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { signUp } from './api';
import { REGISTRATION_INPUTS, REGISTRATION_SCHEMA } from './constants';
import styles from './styles.module.scss';

const RegistrationPage = () => {
    const { showError, showSuccess } = useNotification();
    const controllerRef = useRef<AbortController | null>(null);
    const navigate = useNavigate();
    const { getUserData } = useProfile();

    const handleSubmit = async (data: Record<string, string | File | null>) => {
        const payload = {
            first_name: (data.first_name as string) || '',
            second_name: (data.second_name as string) || '',
            login: (data.login as string) || '',
            email: (data.email as string) || '',
            password: (data.password as string) || '',
            phone: (data.phone as string) || '',
        };
        controllerRef.current = new AbortController();
        try {
            const response = await signUp(payload, {
                signal: controllerRef.current.signal,
            });
            if (response.id) {
                await getUserData();
                navigate(ROUTES.PROFILE);
                showSuccess('Успешная регистрация');
            }
        } catch (error) {
            if (error instanceof ApiError && error.status === 409) {
                if (error.data.reason === 'Login already exists') {
                    showError('Логин уже занят');
                    return;
                } else if (error.data.reason === 'Email already exists') {
                    showError('Email уже занят');
                    return;
                }
            }
            showError('Ошибка регистрации');
        }
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
                <h1>Регистрация</h1>
                <Form
                    submitBtnLabel="Зарегистрироваться"
                    inputs={REGISTRATION_INPUTS}
                    schema={REGISTRATION_SCHEMA}
                    submitHandler={handleSubmit}
                    className={styles.formContainer}
                />
                <span className={styles.link}>
                    Есть аккаунт?
                    <Link href="/login">Войти</Link>
                </span>
            </Grid>
        </Page>
    );
};

export default RegistrationPage;
