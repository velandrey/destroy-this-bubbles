import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    Stack,
    TextField,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';

interface IProfileChangePasswordDialogProps {
    onSubmit: (oldPassword: string, newPassword: string) => void;
}

const ProfileChangePasswordDialog: React.FC<
    IProfileChangePasswordDialogProps
> = ({ onSubmit }) => {
    const [open, setOpen] = React.useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const regexpLowercase = /(?=.*[a-z])/;
    const regexpUppercase = /(?=.*[A-Z])/;
    const regexpNumber = /(?=.*\d)/;
    const regexpSymbol = /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;

    const requirements = [
        {
            text: 'Минимум 8 символов',
            isValid: newPassword.length >= 8,
        },
        {
            text: 'Одна строчная буква',
            isValid: regexpLowercase.test(newPassword),
        },
        {
            text: 'Одна заглавная буква',
            isValid: regexpUppercase.test(newPassword),
        },
        {
            text: 'Одна цифра',
            isValid: regexpNumber.test(newPassword),
        },
        {
            text: 'Один специальный символ',
            isValid: regexpSymbol.test(newPassword),
        },
        {
            text: 'Пароли совпадают',
            isValid:
                newPassword === confirmPassword && confirmPassword.length > 0,
        },
    ];

    const isPasswordValidate = (): boolean => {
        const errors: string[] = [];
        requirements.forEach((rule) => {
            if (!rule.isValid) {
                errors.push(rule.text);
                return rule.text;
            }
        });

        return errors.length === 0;
    };

    const isFormValid = () => {
        return (
            isPasswordValidate() &&
            newPassword.length > 0 &&
            confirmPassword.length > 0 &&
            newPassword === confirmPassword
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid()) {
            onSubmit(oldPassword, newPassword);
            handleClose();
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOpen(false);
    };

    return (
        <>
            <Box sx={{ p: 2 }}>
                <Link
                    component="button"
                    variant="body2"
                    onClick={handleClickOpen}
                    sx={{
                        color: 'primary.main',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        '&:hover': {
                            color: 'primary.dark',
                        },
                    }}
                >
                    Изменить пароль
                </Link>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Изменение пароля
                </DialogTitle>
                <DialogContent>
                    <form id="form-change-password" onSubmit={handleSubmit}>
                        <Box sx={{ p: 2 }}>
                            <Stack direction="column" spacing={2}>
                                <TextField
                                    id="oldPassword"
                                    label="Старый пароль"
                                    name="oldPassword"
                                    value={oldPassword}
                                    type="password"
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
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
                                        setNewPassword(e.target.value)
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
                                        setConfirmPassword(e.target.value)
                                    }
                                    variant="outlined"
                                />
                            </Stack>
                        </Box>

                        <Box sx={{ p: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Требования к паролю:
                            </Typography>
                            <List sx={{ py: 0 }}>
                                {requirements.map((requirement, index) => (
                                    <ListItem key={index} sx={{ p: 0 }}>
                                        <ListItemText
                                            primary={'• ' + requirement.text}
                                            sx={{
                                                '& .MuiListItemText-primary': {
                                                    color: requirement.isValid
                                                        ? 'success.main'
                                                        : 'text.secondary',
                                                },
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit"
                        variant="contained"
                        form="form-change-password"
                        disabled={!isFormValid()}
                    >
                        Изменить пароль
                    </Button>
                    <Button onClick={handleClose}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProfileChangePasswordDialog;
