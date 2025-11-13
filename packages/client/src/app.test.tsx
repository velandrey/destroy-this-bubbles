import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from './App';

const appContent = 'Профиль';

// @ts-ignore
global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve('hey') })
);

test('Example test', async () => {
    render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );
    expect(screen.getByText(appContent)).toBeDefined();
});
