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
        <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/leaderBoard" element={<LeaderBoardPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<Navigate to="/error" />} />
        </Routes>
    );
};

export default App;
