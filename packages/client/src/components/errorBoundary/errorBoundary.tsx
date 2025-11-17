import { ErrorPage } from '@pages/error';
import React, { Component, ErrorInfo, ReactNode } from 'react';

type TProps = {
    children: ReactNode;
    fallback?: ReactNode;
};

type TState = {
    hasError: boolean;
    error?: Error;
};

class ErrorBoundary extends Component<TProps, TState> {
    public state: TState = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): TState {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return <ErrorPage errorCode={500} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
