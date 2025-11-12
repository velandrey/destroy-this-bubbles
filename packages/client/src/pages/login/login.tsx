import { Form } from '@components/form';
import { TInput } from '@components/form/form';
import { Page } from '@components/page';
import { Grid, Link } from '@mui/material';

import styles from './styles.module.scss';

const LoginPage = () => {
    const inputs: TInput[] = [
        {
            inputName: 'name',
            inputLabel: 'Имя',
            placeholder: 'Введите имя',
        },
        {
            inputName: 'password',
            inputLabel: 'Пароль',
            placeholder: 'Введите пароль',
            type: 'password',
        },
    ];

    const handleSubmit = (data: Record<string, string | File | null>) => {
        // Отсюда обращения к API авторизации, пока не реализовано - console.log
        console.log(data);
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
                    resetBtnLabel="Отменить"
                    inputs={inputs}
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
