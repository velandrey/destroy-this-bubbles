import ErrorBoundary from '@components/errorBoundary/errorBoundary';
import { NotificationContainer } from '@components/notificationContainer';
import { withAuth } from '@components/withAuth';
import { ROUTES } from '@constants/routes';
import { useAppDispatch } from '@hooks/redux';
import { CircularProgress, Box } from '@mui/material';
import { ErrorPage } from '@pages/error';
import { ForumPage } from '@pages/forum';
import { GamePage } from '@pages/game';
import { LeaderBoardPage } from '@pages/leaderBoard';
import { LoginPage } from '@pages/login';
import { MenuPage } from '@pages/menu';
import { ProfilePage } from '@pages/profile';
import { RegistrationPage } from '@pages/registration';
import { getUserData } from '@store/slices/profileSlice';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const App = () => {
    const dispatch = useAppDispatch();
    const [isAppReady, setIsAppReady] = useState(false);

    useEffect(() => {
        const initApp = async () => {
            try {
                await dispatch(getUserData()).unwrap();
            } catch (e) {
            } finally {
                setIsAppReady(true);
            }
        };

        initApp();
    }, [dispatch]);

    const ProtectedProfilePage = withAuth(ProfilePage);
    const ProtectedForumPage = withAuth(ForumPage);

    if (!isAppReady) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ErrorBoundary>
            <NotificationContainer />
            <Routes>
                <Route path={ROUTES.MENU} element={<MenuPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route
                    path={ROUTES.REGISTRATION}
                    element={<RegistrationPage />}
                />
                <Route
                    path={ROUTES.PROFILE}
                    element={<ProtectedProfilePage />}
                />
                <Route path={ROUTES.GAME} element={<GamePage />} />
                <Route
                    path={ROUTES.LEADERBOARD}
                    element={<LeaderBoardPage />}
                />
                <Route path={ROUTES.FORUM} element={<ProtectedForumPage />} />
                <Route
                    path={ROUTES.ERROR_500}
                    element={<ErrorPage errorCode={500} />}
                />
                <Route
                    path={ROUTES.ERROR_404}
                    element={<ErrorPage errorCode={404} />}
                />
                <Route
                    path={ROUTES.NOT_FOUND}
                    element={<Navigate to={ROUTES.ERROR_404} />}
                />
            </Routes>
        </ErrorBoundary>
    );
};

export default App;
