import './style.scss';
import React, { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';

interface IProfileChangePasswordDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (oldPassword: string, newPassword: string) => void;
}

const ProfileChangePasswordDialog: React.FC<
    IProfileChangePasswordDialogProps
> = ({ isOpen, onClose, onSubmit }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const regexpLowercase = /(?=.*[a-z])/;
    const regexpUppercase = /(?=.*[A-Z])/;
    const regexpNumber = /(?=.*\d)/;
    const regexpSymbol = /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        if (password.length < 8) {
            errors.push('Пароль должен содержать минимум 8 символов');
        }
        if (!regexpLowercase.test(password)) {
            errors.push('Пароль должен содержать хотя бы одну строчную букву');
        }
        if (!regexpUppercase.test(password)) {
            errors.push('Пароль должен содержать хотя бы одну заглавную букву');
        }
        if (!regexpNumber.test(password)) {
            errors.push('Пароль должен содержать хотя бы одну цифру');
        }
        if (!regexpSymbol.test(password)) {
            errors.push(
                'Пароль должен содержать хотя бы один специальный символ'
            );
        }

        return errors;
    };

    const validateForm = (): boolean => {
        return !(
            validatePassword(newPassword).length > 0 &&
            !confirmPassword &&
            newPassword !== confirmPassword
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(oldPassword, newPassword);
            handleClose();
        }
    };

    const handleClose = () => {
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
        onClose();
    };

    const handleOldPasswordChange = (value: string) => {
        setOldPassword(value);
    };

    const handleNewPasswordChange = (value: string) => {
        setNewPassword(value);
        const newErrors = { ...errors };
        delete newErrors.newPassword;
        if (confirmPassword && value !== confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        } else if (confirmPassword && value === confirmPassword) {
            delete newErrors.confirmPassword;
        }

        setErrors(newErrors);
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        const newErrors = { ...errors };
        delete newErrors.confirmPassword;
        if (newPassword && value !== newPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }
        setErrors(newErrors);
    };

    const isFormValid = () => {
        return (
            newPassword.length > 0 &&
            confirmPassword.length > 0 &&
            newPassword === confirmPassword &&
            validatePassword(newPassword).length === 0
        );
    };

    if (!isOpen) return null;

    return (
        <div className="change-password-dialog">
            <div
                className="change-password-dialog__overlay"
                onClick={handleClose}
            />
            <div className="change-password-dialog__content">
                <div className="change-password-dialog__header">
                    <h3 className="change-password-dialog__title">
                        Изменение пароля
                    </h3>
                    <button
                        className="change-password-dialog__close"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </div>

                <form
                    className="change-password-dialog__form"
                    onSubmit={handleSubmit}
                >
                    <Box sx={{ p: 2 }}>
                        <Stack direction="column" spacing={2}>
                            <TextField
                                id="oldPassword"
                                label="Старый пароль"
                                name="oldPassword"
                                value={oldPassword}
                                type="password"
                                onChange={(e) =>
                                    handleOldPasswordChange(e.target.value)
                                }
                                variant="outlined"
                            />
                            <TextField
                                id="newPassword"
                                label="Новый пароль"
                                name="newPassword"
                                value={newPassword}
                                type="password"
                                onChange={(e) =>
                                    handleNewPasswordChange(e.target.value)
                                }
                                variant="outlined"
                            />
                            <TextField
                                id="confirmPassword"
                                label="Повторите пароль"
                                name="confirmPassword"
                                value={confirmPassword}
                                type="password"
                                onChange={(e) =>
                                    handleConfirmPasswordChange(e.target.value)
                                }
                                variant="outlined"
                            />
                        </Stack>
                    </Box>

                    <div className="change-password-dialog__requirements">
                        <ul className="change-password-dialog__requirements-list">
                            <li
                                className={
                                    newPassword.length >= 8 ? 'valid' : ''
                                }
                            >
                                Минимум 8 символов
                            </li>
                            <li
                                className={
                                    regexpLowercase.test(newPassword)
                                        ? 'valid'
                                        : ''
                                }
                            >
                                Одна строчная буква
                            </li>
                            <li
                                className={
                                    regexpUppercase.test(newPassword)
                                        ? 'valid'
                                        : ''
                                }
                            >
                                Одна заглавная буква
                            </li>
                            <li
                                className={
                                    regexpNumber.test(newPassword)
                                        ? 'valid'
                                        : ''
                                }
                            >
                                Одна цифра
                            </li>
                            <li
                                className={
                                    regexpSymbol.test(newPassword)
                                        ? 'valid'
                                        : ''
                                }
                            >
                                Один специальный символ
                            </li>
                            <li
                                className={
                                    newPassword === confirmPassword &&
                                    confirmPassword.length > 0
                                        ? 'valid'
                                        : ''
                                }
                            >
                                Пароли совпадают
                            </li>
                        </ul>
                    </div>
                    <div className="change-password-dialog__actions">
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={!isFormValid()}
                        >
                            Изменить пароль
                        </Button>
                        <Button
                            variant="outlined"
                            className="profile__submit"
                            onClick={handleClose}
                        >
                            Отмена
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileChangePasswordDialog;
