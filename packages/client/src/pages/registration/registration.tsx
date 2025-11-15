import { Form } from '@components/form';
import { Page } from '@components/page';
import { Grid, Link } from '@mui/material';

import { REGISTRATION_INPUTS } from './constants';
import styles from './styles.module.scss';

const RegistrationPage = () => {
    const handleSubmit = (data: Record<string, string | File | null>) => {
        // Отсюда обращения к API регистрации, пока не реализовано - console.log
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
                <h1>Регистрация</h1>
                <Form
                    submitBtnLabel="Зарегистрироваться"
                    inputs={REGISTRATION_INPUTS}
                    onSubmit={handleSubmit}
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
