import { TInput } from '@components/form';

export const REGISTRATION_INPUTS: TInput[] = [
    {
        inputName: 'first_name',
        inputLabel: 'Имя',
        placeholder: 'Введите имя',
    },
    {
        inputName: 'second_name',
        inputLabel: 'Фамилия',
        placeholder: 'Введите фамилию',
    },
    {
        inputName: 'login',
        inputLabel: 'Логин',
        placeholder: 'Введите логин',
    },
    {
        inputName: 'email',
        inputLabel: 'Email',
        placeholder: 'Введите email',
        type: 'email',
    },
    {
        inputName: 'password',
        inputLabel: 'Пароль',
        placeholder: 'Введите пароль',
        type: 'password',
    },
    {
        inputName: 'phone',
        inputLabel: 'Телефон',
        placeholder: 'Введите номер телефона',
        type: 'tel',
    },
];
