import { createStore } from './store';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import App from './App';

const appContent = 'Профиль';

const store = createStore();

// @ts-ignore
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve('hey'),
    })
);

test('Example test', async () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <App />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByText(appContent)).toBeDefined();
});
