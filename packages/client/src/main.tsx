import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '@styles/theme';
import createEmotionCache from '@utils/createEmotionCache';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './styles/style.scss';
import { registerSW } from 'virtual:pwa-register';

import App from './App';
import { createStore } from './store';

const cache = createEmotionCache();

const preloadedState = window.__INITIAL_STATE__;
delete window.__INITIAL_STATE__;

const store = createStore(preloadedState);

ReactDOM.hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <CacheProvider value={cache}>
        <Provider store={store}>
            <BrowserRouter>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </BrowserRouter>
        </Provider>
    </CacheProvider>
);

// Регистрируем Service Worker с авто обновлением
registerSW({ immediate: true });
