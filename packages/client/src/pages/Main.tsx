import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { fetchUserThunk, selectUser } from '../slices/userSlice';
import { useSelector } from '../store';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

export const MainPage = () => {
    const user = useSelector(selectUser);

    const [value, setValue] = useState('');

    usePage({ initPage: initMainPage });
    return (
        <div>
            <Button variant="contained" color="primary">
                Click me
            </Button>
            <br />
            <br />
            <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <br />
            <br />
            <TextField
                id="filled-basic"
                label="Filled"
                variant="filled"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <br />
            <br />
            <TextField
                id="standard-basic"
                label="Standard"
                variant="standard"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <br />
            <Helmet>
                <meta charSet="utf-8" />
                <title>Главная</title>
                <meta
                    name="description"
                    content="Главная страница с информацией о пользователе"
                />
            </Helmet>
            <Header />
            <Link href="#">
                <Icon viewBox="0 0 20 20">
                    <path d="M10 15h8c1 0 2-1 2-2V3c0-1-1-2-2-2H2C1 1 0 2 0 3v10c0 1 1 2 2 2h4v4l4-4zM5 7h2v2H5V7zm4 0h2v2H9V7zm4 0h2v2h-2V7z" />
                </Icon>
                <Label>Hovering my parent changes my style!</Label>
            </Link>
            {user ? (
                <div>
                    <p>{user.name}</p>
                    <p>{user.secondName}</p>
                </div>
            ) : (
                <p>Пользователь не найден!</p>
            )}
        </div>
    );
};

const Link = styled.a`
    display: flex;
    align-items: center;
    padding: 5px 10px;
    background: papayawhip;
    color: #bf4f74;
`;

const Icon = styled.svg`
    flex: none;
    transition: fill 0.25s;
    width: 48px;
    height: 48px;

    ${Link}:hover & {
        fill: rebeccapurple;
    }
`;

const Label = styled.span`
    display: flex;
    align-items: center;
    line-height: 1.2;

    &::before {
        content: '◀';
        margin: 0 10px;
    }
`;

export const initMainPage = async ({ dispatch, state }: PageInitArgs) => {
    if (!selectUser(state)) {
        return dispatch(fetchUserThunk());
    }
};
