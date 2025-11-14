import { Box, Button, Stack, TextField } from '@mui/material';
import { IProfile } from '@pages/profile/constants';
import React from 'react';

interface ProfileFormProps {
    profile: IProfile;
    onSubmit: (e: React.FormEvent) => void;
    onInputChange: (field: keyof IProfile, value: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
    profile,
    onSubmit,
    onInputChange,
}) => {
    return (
        <form onSubmit={onSubmit}>
            <Box sx={{ p: 2 }}>
                <Stack direction="column" spacing={2}>
                    <TextField
                        id="first_name"
                        label="Имя"
                        name="first_name"
                        value={profile.first_name}
                        type="text"
                        onChange={(e) =>
                            onInputChange('first_name', e.target.value)
                        }
                        variant="outlined"
                    />
                    <TextField
                        id="second_name"
                        label="Фамилия"
                        name="second_name"
                        value={profile.second_name}
                        type="text"
                        onChange={(e) =>
                            onInputChange('second_name', e.target.value)
                        }
                        variant="outlined"
                    />
                    <TextField
                        id="display_name"
                        label="Никнейм"
                        name="display_name"
                        value={profile.display_name}
                        type="text"
                        onChange={(e) =>
                            onInputChange('display_name', e.target.value)
                        }
                        variant="outlined"
                    />
                    <TextField
                        id="email"
                        label="Email"
                        name="email"
                        value={profile.email}
                        type="email"
                        onChange={(e) => onInputChange('email', e.target.value)}
                        variant="outlined"
                    />
                    <TextField
                        id="phone"
                        label="Телефон"
                        name="phone"
                        value={profile.phone}
                        type="tel"
                        onChange={(e) => onInputChange('phone', e.target.value)}
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        className="profile__submit"
                    >
                        Сохранить изменения
                    </Button>
                </Stack>
            </Box>
        </form>
    );
};

export default ProfileForm;
