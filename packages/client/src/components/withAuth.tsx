import { ROUTES } from '@constants/routes';
import { useAuth } from '@hooks/useAuth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    const AuthenticatedComponent: React.FC<P> = (props) => {
        const { isAuth, isLoading } = useAuth();
        const navigate = useNavigate();

        useEffect(() => {
            if (!isLoading && !isAuth) {
                navigate(ROUTES.LOGIN);
            }
        }, [isAuth, isLoading, navigate]);

        if (isLoading || !isAuth) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthenticatedComponent;
};
