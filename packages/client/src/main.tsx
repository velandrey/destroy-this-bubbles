import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { store } from '@store/index';
import { darkTheme } from '@styles/theme';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import './styles/style.scss';

import App from './App';
import { registerSW } from 'virtual:pwa-register';

ReactDOM.hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </Provider>
);

// Регистрируем Service Worker с авто обновлением
registerSW({ immediate: true });
