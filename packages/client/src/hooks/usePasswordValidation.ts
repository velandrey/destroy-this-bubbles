import { useMemo } from 'react';

export interface PasswordRequirement {
    text: string;
    isValid: boolean;
}

export const usePasswordValidation = (
    password: string,
    confirmPassword = ''
) => {
    const regexpLowercase = /(?=.*[a-z])/;
    const regexpUppercase = /(?=.*[A-Z])/;
    const regexpNumber = /(?=.*\d)/;
    const regexpSymbol = /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;

    const requirements = useMemo(
        (): PasswordRequirement[] => [
            {
                text: 'Минимум 8 символов',
                isValid: password.length >= 8,
            },
            {
                text: 'Одна строчная буква',
                isValid: regexpLowercase.test(password),
            },
            {
                text: 'Одна заглавная буква',
                isValid: regexpUppercase.test(password),
            },
            {
                text: 'Одна цифра',
                isValid: regexpNumber.test(password),
            },
            {
                text: 'Один специальный символ',
                isValid: regexpSymbol.test(password),
            },
            {
                text: 'Пароли совпадают',
                isValid:
                    password === confirmPassword && confirmPassword.length > 0,
            },
        ],
        [password, confirmPassword]
    );

    const isPasswordValid = useMemo(() => {
        return requirements.every((requirement) => requirement.isValid);
    }, [requirements]);

    return {
        requirements,
        isPasswordValid,
    };
};
