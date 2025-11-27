import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';
import { useEffect } from 'react';

export const useAuth = (redirectIfNotAuth = true) => {
    const isAuth = localStorage.getItem('isAuth');
    const navigate = useNavigate();

    useEffect(() => {
        if (redirectIfNotAuth && !isAuth) {
            navigate(ROUTES.LOGIN);
        }
    }, [isAuth, navigate, redirectIfNotAuth]);

    return isAuth;
};
