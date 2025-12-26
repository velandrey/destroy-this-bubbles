import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '@styles/theme';
import createEmotionCache from '@utils/createEmotionCache';
import App from 'App';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';

import { createStore } from './store';

export const render = async (_url: string) => {
    const cache = createEmotionCache();
    const { constructStyleTagsFromChunks, extractCriticalToChunks } =
        createEmotionServer(cache);

    const store = createStore();

    const html = ReactDOM.renderToString(
        <CacheProvider value={cache}>
            <StaticRouter location={_url}>
                <Provider store={store}>
                    <ThemeProvider theme={darkTheme}>
                        <CssBaseline />
                        <App />
                    </ThemeProvider>
                </Provider>
            </StaticRouter>
        </CacheProvider>
    );

    const chunks = extractCriticalToChunks(html);
    const styles = constructStyleTagsFromChunks(chunks);

    return { html, styles, state: store.getState() };
};
