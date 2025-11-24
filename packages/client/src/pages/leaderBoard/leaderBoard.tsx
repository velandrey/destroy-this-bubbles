import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LeaderBoardPage = () => {
    const navigate = useNavigate();

    return (
        <Page>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(ROUTES.MENU)}
            >
                Назад
            </Button>
        </Page>
    );
};

export default LeaderBoardPage;
