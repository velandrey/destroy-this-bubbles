import { ROUTES } from '@constants/routes';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Link,
} from '@mui/material';
import {
    ForumText,
    GameTitle,
    LeaderboardText,
    ProfileText,
} from '@pages/menu/constants';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

const Header: React.FC = () => {
    const { isAuth } = useAuth();
    const { user, logout } = useProfile();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

    const handleLogin = () => {
        navigate(ROUTES.LOGIN);
    };

    const handleProfile = () => {
        navigate(ROUTES.PROFILE);
    };

    const handleHome = () => {
        navigate(ROUTES.MENU);
    };

    return (
        <AppBar position="static">
            <Toolbar className={styles.header_toolbar}>
                <Typography className={styles.header_logo} onClick={handleHome}>
                    {GameTitle}
                </Typography>
                <nav className={styles.navigation}>
                    <MenuItem text={ProfileText} path={ROUTES.PROFILE} />
                    <MenuItem
                        text={LeaderboardText}
                        path={ROUTES.LEADERBOARD}
                    />
                    <MenuItem text={ForumText} path={ROUTES.FORUM} />
                </nav>

                {isAuth ? (
                    <Box className={styles.header_profile}>
                        <Box
                            className={styles.header_profile_nav}
                            onClick={handleProfile}
                        >
                            {user?.avatar && (
                                <Avatar
                                    src={user.avatar}
                                    alt={user.display_name || user.login}
                                    className={styles.header_avatar}
                                />
                            )}
                            <Typography className={styles.header_login}>
                                {user?.display_name ||
                                    user?.login ||
                                    'Пользователь'}
                            </Typography>
                        </Box>

                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            variant="outlined"
                        >
                            Выйти
                        </Button>
                    </Box>
                ) : (
                    <Button color="inherit" onClick={handleLogin}>
                        Войти
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
