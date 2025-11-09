import { initFriendsPage, FriendsPage } from './pages/FriendsPage';
import { initMainPage, MainPage } from './pages/Main';
import { initNotFoundPage, NotFoundPage } from './pages/NotFound';
import { AppDispatch, RootState } from './store';

export type PageInitContext = {
    clientToken?: string;
};

export type PageInitArgs = {
    dispatch: AppDispatch;
    state: RootState;
    ctx: PageInitContext;
};

export const routes = [
    {
        path: '/',
        Component: MainPage,
        fetchData: initMainPage,
    },
    {
        path: '/friends',
        Component: FriendsPage,
        fetchData: initFriendsPage,
    },
    {
        path: '*',
        Component: NotFoundPage,
        fetchData: initNotFoundPage,
    },
];
