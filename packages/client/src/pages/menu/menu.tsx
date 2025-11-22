import { Page } from '@components/page';
import { Button, Link } from '@mui/material';

import {
    GameTitle,
    GameDescription,
    GameRules,
    GameGoal,
    PlayText,
    ProfileText,
    ForumText,
    LeaderboardText,
} from './constants';
import styles from './styles.module.scss';

type TMenuItem = {
    text: string;
    path: string;
};
const MenuItem = ({ text, path }: TMenuItem): JSX.Element => (
    <Link underline="none" href={path}>
        {text}
    </Link>
);

const MenuPage = () => {
    return (
        <Page className={styles.container}>
            <nav className={styles.navigation}>
                <MenuItem text={ProfileText} path="/game" />
                <MenuItem text={LeaderboardText} path="/leaderBoard" />
                <MenuItem text={ForumText} path="/profile" />
            </nav>
            <article className={styles.content}>
                <h1>{GameTitle}</h1>
                <p className={styles.discription}>{GameDescription}</p>
                <p className={styles.discription}>{GameRules}</p>
                <p className={styles.discription}>{GameGoal}</p>
            </article>
            <Button
                variant="contained"
                color="primary"
                href="/game"
                className={styles.playButton}
            >
                {PlayText}
            </Button>
        </Page>
    );
};

export default MenuPage;
