import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './styles/style.scss';
import { darkTheme } from '@styles/theme';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

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
