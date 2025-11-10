import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './routes';
import { store } from './store';

import './styles/style.scss';

const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
