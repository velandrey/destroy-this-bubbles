import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import MenuPage from './menu';
import '@testing-library/jest-dom';

describe('MenuPage visual snapshot', () => {
    test('renders and matches snapshot (screenshot)', () => {
        const { asFragment } = render(
            <MemoryRouter>
                <MenuPage />
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
