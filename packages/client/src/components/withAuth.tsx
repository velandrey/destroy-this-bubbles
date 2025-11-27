import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

export const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    const AuthenticatedComponent: React.FC<P> = (props) => {
        const navigate = useNavigate();
        const isAuth = !!localStorage.getItem('isAuth');

        React.useEffect(() => {
            if (!isAuth) {
                navigate(ROUTES.LOGIN);
            }
        }, [isAuth, navigate]);

        if (!isAuth) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return AuthenticatedComponent;
};
