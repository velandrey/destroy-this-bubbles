const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
    globals: {
        __SERVER_PORT__: process.env.SERVER_PORT,
        __EXTERNAL_SERVER_URL__: process.env.EXTERNAL_SERVER_URL || 'http://localhost:3001',
        __INTERNAL_SERVER_URL__: process.env.INTERNAL_SERVER_URL || 'http://localhost:3001',
    },
    moduleNameMapper: {
        '\\.(scss|css)$': 'identity-obj-proxy',
        '^@slices/(.*)$': '<rootDir>/src/slices/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@store/(.*)$': '<rootDir>/src/store/$1',
        '^@styles/(.*)$': '<rootDir>/src/styles/$1',
        '^game/(.*)$': '<rootDir>/src/game/$1',
    },
};
