import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import './styles/style.scss';
import { darkTheme } from '@styles/theme';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

ReactDOM.hydrateRoot(
    document.getElementById('root') as HTMLElement,
    // <Provider store={store}>
    <BrowserRouter>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </BrowserRouter>
    // </Provider>
);
