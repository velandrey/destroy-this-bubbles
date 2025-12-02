import ErrorBoundary from '@components/errorBoundary/errorBoundary';
import { NotificationContainer } from '@components/notificationContainer';
import { withAuth } from '@components/withAuth';
import { ROUTES } from '@constants/routes';
import { useAppDispatch } from '@hooks/redux';
import { ErrorPage } from '@pages/error';
import { ForumPage, TopicPage } from '@pages/forum';
import { GamePage } from '@pages/game';
import { LeaderBoardPage } from '@pages/leaderBoard';
import { LoginPage } from '@pages/login';
import { MenuPage } from '@pages/menu';
import { ProfilePage } from '@pages/profile';
import { RegistrationPage } from '@pages/registration';
import { getUserData } from '@store/slices/profileSlice';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getUserData());
    }, [dispatch]);

    const ProtectedProfilePage = withAuth(ProfilePage);
    const ProtectedForumPage = withAuth(ForumPage);
    const ProtectedGamePage = withAuth(GamePage);
    const ProtectedTopicPage = withAuth(TopicPage);

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
                <Route path={ROUTES.GAME} element={<ProtectedGamePage />} />
                <Route
                    path={ROUTES.LEADERBOARD}
                    element={<LeaderBoardPage />}
                />
                <Route path={ROUTES.FORUM} element={<ProtectedForumPage />} />
                <Route path={ROUTES.TOPIC} element={<ProtectedTopicPage />} />
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
