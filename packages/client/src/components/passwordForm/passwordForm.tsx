import { Box, Stack, TextField } from '@mui/material';
import React from 'react';

export type TPasswordFormData = {
    oldPassword?: string;
    newPassword: string;
    confirmPassword: string;
};

type TPasswordFormProps = {
    formData: TPasswordFormData;
    onChange: (data: TPasswordFormData) => void;
    showOldPassword?: boolean;
};

const PasswordForm: React.FC<TPasswordFormProps> = ({
    formData,
    onChange,
    showOldPassword = true,
}) => {
    const handleFieldChange =
        (field: keyof TPasswordFormData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...formData,
                [field]: e.target.value,
            });
        };

    return (
        <Box>
            <Stack direction="column" spacing={2}>
                {showOldPassword && (
                    <TextField
                        id="oldPassword"
                        label="Старый пароль"
                        name="oldPassword"
                        value={formData.oldPassword || ''}
                        type="password"
                        onChange={handleFieldChange('oldPassword')}
                        variant="outlined"
                    />
                )}
                <TextField
                    id="newPassword"
                    label="Новый пароль"
                    name="newPassword"
                    value={formData.newPassword}
                    type="password"
                    onChange={handleFieldChange('newPassword')}
                    variant="outlined"
                />
                <TextField
                    id="confirmPassword"
                    label="Повторите пароль"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    type="password"
                    onChange={handleFieldChange('confirmPassword')}
                    variant="outlined"
                />
            </Stack>
        </Box>
    );
};

export default PasswordForm;
