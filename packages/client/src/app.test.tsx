import { store } from '@store/index';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import App from './App';

const appContent = 'Профиль';

// @ts-ignore
global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve('hey') })
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
