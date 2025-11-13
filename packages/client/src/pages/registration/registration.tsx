import { Page } from '@components/page';
import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const navigate = useNavigate();

    return (
        <Page>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
            >
                Регистрация
            </Button>
        </Page>
    );
};

export default RegistrationPage;
