import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
    GameTitle,
    GameDescription,
    GameRules,
    GameGoal,
    PlayText,
} from './constants';
import styles from './styles.module.scss';

const MenuPage = () => {
    const navigate = useNavigate();
    return (
        <Page className={styles.container}>
            <article className={styles.content}>
                <h1>{GameTitle}</h1>
                <p className={styles.discription}>{GameDescription}</p>
                <p className={styles.discription}>{GameRules}</p>
                <p className={styles.discription}>{GameGoal}</p>
            </article>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(ROUTES.GAME)}
                className={styles.playButton}
            >
                {PlayText}
            </Button>
        </Page>
    );
};

export default MenuPage;
