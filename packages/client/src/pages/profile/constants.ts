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

export const PROFILE_INPUTS: TInputsMap = {
    first_name: {
        label: 'Имя',
        placeholder: 'Введите имя',
    },
    second_name: {
        label: 'Фамилия',
        placeholder: 'Введите фамилию',
    },
    display_name: {
        label: 'Никнейм',
        placeholder: 'Введите никнейм',
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
} as const;

export const PROFILE_SCHEMA = object({
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
    display_name: pipe(string(), trim()),
    email: pipe(
        string(),
        trim(),
        regex(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$/,
            'Некорректный email'
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
});
