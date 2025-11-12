import { Form } from '@components/form';
import { TInput } from '@components/form/form';
import { Page } from '@components/page';
import { Grid } from '@mui/material';

const LoginPage = () => {
    const inputs: TInput[] = [
        {
            inputName: 'name',
            inputLabel: 'Имя',
            placeholder: 'Введите имя',
        },
        {
            inputName: 'email',
            inputLabel: 'Email',
        },
    ];

    const handleSubmit = (data: Record<string, string | File | null>) => {
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
                <Form
                    submitBtnLabel="Войти"
                    resetBtnLabel="Отменить"
                    inputs={inputs}
                    onSubmit={handleSubmit}
                />
            </Grid>
        </Page>
    );
};

export default LoginPage;
