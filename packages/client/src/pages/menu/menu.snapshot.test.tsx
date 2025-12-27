import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import MenuPage from './menu';
import '@testing-library/jest-dom';

jest.mock('@hooks/useOAuth', () => ({
    useOAuth: () => ({
        handleOAuthCallback: jest.fn(),
    }),
}));

jest.mock('@components/page', () => ({
    Page: ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className: string;
    }) => <div className={className}>{children}</div>,
}));

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
