import { Button, TextField } from '@mui/material';
import { LoginPage } from '@pages/login';
import { MenuPage } from '@pages/menu';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
};

export default App;
