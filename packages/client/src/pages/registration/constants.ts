import { TInputsMap } from '@components/form';
import {
    object,
    string,
    minLength,
    regex,
    pipe,
    maxLength,
    trim,
} from 'valibot';

export const REGISTRATION_INPUTS: TInputsMap = {
    first_name: {
        label: 'Имя',
        placeholder: 'Введите имя',
    },
    second_name: {
        label: 'Фамилия',
        placeholder: 'Введите фамилию',
    },
    login: {
        label: 'Логин',
        placeholder: 'Введите логин',
    },
    email: {
        label: 'Email',
        placeholder: 'Введите email',
        type: 'email',
    },
    phone: {
        label: 'Телефон',
        placeholder: 'Введите телефон',
        type: 'tel',
    },
    password: {
        label: 'Пароль',
        placeholder: 'Введите пароль',
        type: 'password',
    },
} as const;

export const REGISTRATION_SCHEMA = object({
    first_name: pipe(
        string(),
        trim(),
        minLength(1, 'Имя не может быть пустым'),
        maxLength(50, 'Имя не может быть длиннее 50 символов'),
        regex(
            /^[A-ZА-ЯЁ][a-zа-яё]+(?:-[A-ZА-ЯЁ][a-zа-яё]+)?$/,
            'Допустима только латиница/кириллица, только первая буква — заглавная'
        )
    ),
    second_name: pipe(
        string(),
        trim(),
        minLength(1, 'Фамилия не может быть пустой'),
        maxLength(50, 'Фамилия не может быть длиннее 50 символов'),
        regex(
            /^[A-ZА-ЯЁ][a-zа-яё]+(?:-[A-ZА-ЯЁ][a-zа-яё]+)?$/,
            'Допустима только латиница/кириллица, только первая буква — заглавная'
        )
    ),
    login: pipe(
        string(),
        trim(),
        minLength(3, 'Логин не может быть короче 3 символов'),
        maxLength(20, 'Логин не может быть длиннее 20 символов'),
        regex(
            /^[A-Za-z0-9_-]+$/,
            'Допустимы только латинские буквы, цифры, дефис и подчеркивание'
        ),
        regex(/^(?!\d+$).+$/, 'Логин не может состоять только из цифр')
    ),
    email: pipe(
        string(),
        trim(),
        regex(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$/,
            'Некорректный формат email'
        )
    ),
    phone: pipe(
        string(),
        trim(),
        regex(
            /^\+?\d{10,15}$/,
            'Телефон должен содержать от 10 до 15 цифр и может начинаться с +'
        )
    ),
    password: pipe(
        string(),
        minLength(8, 'Пароль не может быть короче 8 символов'),
        maxLength(40, 'Пароль не может быть длиннее 40 символов'),
        regex(
            /[A-ZА-яЁё]/,
            'Пароль должен содержать хотя бы одну заглавную букву'
        ),
        regex(/\d/, 'Пароль должен содержать хотя бы одну цифру')
    ),
});
