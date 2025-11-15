import { Form } from '@components/form';
import { Page } from '@components/page';
import { Grid, Link } from '@mui/material';

import { LOGIN_INPUTS, LOGIN_SCHEMA } from './constants';
import styles from './styles.module.scss';

const LoginPage = () => {
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
                    inputs={LOGIN_INPUTS}
                    schema={LOGIN_SCHEMA}
                    submitHandler={handleSubmit}
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
