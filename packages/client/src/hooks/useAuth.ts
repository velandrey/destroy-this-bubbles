import { useAppSelector } from './redux';

export const useAuth = () => {
    const { isAuth, isLoading } = useAppSelector((state) => state.profile);
    return { isAuth, isLoading };
};
