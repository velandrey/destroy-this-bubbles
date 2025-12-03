import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { object, pipe, string, minLength, trim } from 'valibot';

import Form from './form';

const requiredField = (message: string) =>
    pipe(string(), trim(), minLength(1, message));

describe('Form', () => {
    test('initialization renders inputs with trimmed defaults and keeps actions disabled', () => {
        const inputs = {
            login: {
                label: 'Login',
                defaultValue: '  user  ',
            },
            password: {
                label: 'Password',
            },
        } as const;

        render(
            <Form
                inputs={inputs}
                schema={object({
                    login: requiredField('Login is required'),
                    password: requiredField('Password is required'),
                })}
                submitBtnLabel="Submit"
                resetBtnLabel="Reset form"
                submitHandler={jest.fn()}
            />
        );

        const loginInput = screen.getByLabelText('Login') as HTMLInputElement;
        expect(loginInput).toHaveValue('user');

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        expect(submitButton).toBeDisabled();

        const resetButton = screen.getByRole('button', { name: 'Reset form' });
        expect(resetButton).toBeDisabled();
    });

    test('shows validation errors only after blur or submit', async () => {
        const inputs = {
            email: {
                label: 'Email',
            },
        } as const;

        render(
            <Form
                inputs={inputs}
                schema={object({
                    email: requiredField('Email is required'),
                })}
                submitBtnLabel="Submit"
                submitHandler={jest.fn()}
            />
        );

        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();

        fireEvent.blur(emailInput);

        expect(await screen.findByText('Email is required')).toBeVisible();
    });

    test('reset button restores defaults, clears dirty state, and calles reset handler', async () => {
        const resetHandler = jest.fn();
        const inputs = {
            username: {
                label: 'Username',
                defaultValue: 'Vasya',
            },
        } as const;

        render(
            <Form
                inputs={inputs}
                schema={object({
                    username: requiredField('Username is required'),
                })}
                submitBtnLabel="Submit"
                resetBtnLabel="Reset form"
                submitHandler={jest.fn()}
                resetHandler={resetHandler}
            />
        );

        const usernameInput = screen.getByLabelText('Username');
        fireEvent.change(usernameInput, { target: { value: 'Petya' } });

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        await waitFor(() => expect(submitButton).not.toBeDisabled());

        const resetButton = screen.getByRole('button', { name: 'Reset form' });
        fireEvent.click(resetButton);

        await waitFor(() => expect(usernameInput).toHaveValue('Vasya'));
        expect(resetHandler).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(submitButton).toBeDisabled());
    });
});
