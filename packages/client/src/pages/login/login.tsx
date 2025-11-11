import { Page } from '@components/page';
import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <Page>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
            >
                Вход
            </Button>
        </Page>
    );
};

export default LoginPage;
