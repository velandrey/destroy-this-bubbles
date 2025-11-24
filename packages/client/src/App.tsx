import ErrorBoundary from '@components/errorBoundary/errorBoundary';
import { ROUTES } from '@constants/routes';
import { ErrorPage } from '@pages/error';
import { ForumPage } from '@pages/forum';
import { GamePage } from '@pages/game';
import { LeaderBoardPage } from '@pages/leaderBoard';
import { LoginPage } from '@pages/login';
import { MenuPage } from '@pages/menu';
import { ProfilePage } from '@pages/profile';
import { RegistrationPage } from '@pages/registration';
import { Navigate, Route, Routes } from 'react-router-dom';

const App = () => {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path={ROUTES.MENU} element={<MenuPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route
                    path={ROUTES.REGISTRATION}
                    element={<RegistrationPage />}
                />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path={ROUTES.GAME} element={<GamePage />} />
                <Route
                    path={ROUTES.LEADERBOARD}
                    element={<LeaderBoardPage />}
                />
                <Route path={ROUTES.FORUM} element={<ForumPage />} />
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
