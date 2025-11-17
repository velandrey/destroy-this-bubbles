import { Box, Button, Stack, TextField } from '@mui/material';
import { TProfile } from '@pages/profile/types';
import React from 'react';

import styles from './styles.module.scss';

type TProfileFormProps = {
    profile: TProfile;
    onSubmit: (e: React.FormEvent) => void;
    onInputChange: (field: keyof TProfile, value: string) => void;
};

const ProfileForm: React.FC<TProfileFormProps> = ({
    profile,
    onSubmit,
    onInputChange,
}) => {
    return (
        <Box className={styles.profile__form_box}>
            <form onSubmit={onSubmit}>
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
            </form>
        </Box>
    );
};

export default ProfileForm;
