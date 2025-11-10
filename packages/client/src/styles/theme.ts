import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        // TODO all: попробовать реализовать темную тему
        background: {
            default: '#222222',
            paper: '#333333',
        },
    },
});
