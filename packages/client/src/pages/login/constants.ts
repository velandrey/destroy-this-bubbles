import { TInputsMap } from '@components/form';
import { object, string, minLength, regex, pipe, maxLength } from 'valibot';

export const LOGIN_INPUTS: TInputsMap = {
    login: {
        label: 'Логин',
        placeholder: 'Введите логин',
    },
    password: {
        label: 'Пароль',
        placeholder: 'Введите пароль',
        type: 'password',
    },
} as const;

export const LOGIN_SCHEMA = object({
    login: pipe(
        string(),
        minLength(3, 'Логин не может быть короче 3 символов'),
        maxLength(20, 'Логин не может быть длиннее 20 символов'),
        regex(
            /^[A-Za-z0-9_-]+$/,
            'Допустимы только латинские буквы, цифры, дефис и подчеркивание'
        ),
        regex(/^(?!\d+$).+$/, 'Логин не может состоять только из цифр')
    ),
    password: pipe(
        string(),
        minLength(8, 'Пароль не может быть короче 8 символов'),
        maxLength(40, 'Пароль не может быть длиннее 40 символов')
    ),
});
