import { PasswordForm } from '@components/passwordForm';
import { TPasswordFormData } from '@components/passwordForm/passwordForm';
import { PasswordRequirementsList } from '@components/passwordRequirementsList';
import { usePasswordValidation } from '@hooks/usePasswordValidation';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
} from '@mui/material';
import { TProfileChangePasswordDialogProps } from '@pages/profile/types';
import React, { useState } from 'react';

import styles from './styles.module.scss';

const ProfileChangePasswordDialog: React.FC<
    TProfileChangePasswordDialogProps
> = ({ onSubmit }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<TPasswordFormData>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const { requirements, isPasswordValid } = usePasswordValidation(
        formData.newPassword,
        formData.confirmPassword
    );

    const isFormValid = () => {
        return (
            isPasswordValid &&
            formData.newPassword.length > 0 &&
            formData.confirmPassword.length > 0 &&
            formData.newPassword === formData.confirmPassword &&
            (formData.oldPassword?.length ?? 0) > 0
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid() && formData.oldPassword) {
            onSubmit(formData.oldPassword, formData.newPassword);
            handleClose();
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setOpen(false);
    };

    return (
        <>
            <Box className={styles.profile__link_changepass}>
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
                        <PasswordForm
                            formData={formData}
                            onChange={setFormData}
                        />
                        <PasswordRequirementsList requirements={requirements} />
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
