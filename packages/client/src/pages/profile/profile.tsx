import './style.scss';
import { Page } from '@components/page';
import ProfileAvatarUpload from '@components/profileAvatarUpload';
import ProfileChangePasswordDialog from '@components/profileChangePasswordDialog';
import { defaultAvatar } from '@constants/constants';
import { useProfile } from '@hooks/useProfile';
import { Box, Button, Grid, Stack, TextField } from '@mui/material';
import { IProfile } from '@pages/profile/constants';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<IProfile>({
        first_name: '',
        second_name: '',
        display_name: '',
        phone: '',
        login: '',
        avatar: '',
        email: '',
    });
    const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatar);
    const { getUserData, changeProfile, changePassword } = useProfile();

    const getProfileData = async () => {
        try {
            const profile = await getUserData();
            setProfile(profile);
            if (profile.avatar) {
                setAvatarUrl(profile.avatar);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleInputChange = (field: keyof IProfile, value: string) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await changeProfile({
            first_name: profile.first_name,
            second_name: profile.second_name,
            display_name: profile.display_name,
            phone: profile.phone,
            login: profile.login,
            email: profile.email,
        });
    };

    const handleAvatarChange = async () => {
        await getProfileData();
    };

    const handlePasswordChange = async (
        oldPassword: string,
        newPassword: string
    ) => {
        await changePassword({
            oldPassword: oldPassword,
            newPassword: newPassword,
        });
    };

    useEffect(() => {
        (async () => {
            await getProfileData();
        })();
    }, []);

    return (
        <Page>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/menu')}
            >
                Меню
            </Button>
            <Grid
                container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <h1>Профиль игрока</h1>
                <ProfileAvatarUpload
                    currentAvatar={avatarUrl}
                    onAvatarChange={handleAvatarChange}
                    size={120}
                />
                <form onSubmit={handleSubmit}>
                    <Box sx={{ p: 2 }}>
                        <Stack direction="column" spacing={2}>
                            <TextField
                                id="first_name"
                                label="Имя"
                                name="first_name"
                                value={profile.first_name}
                                type="text"
                                onChange={(e) =>
                                    handleInputChange(
                                        'first_name',
                                        e.target.value
                                    )
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
                                    handleInputChange(
                                        'second_name',
                                        e.target.value
                                    )
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
                                    handleInputChange(
                                        'display_name',
                                        e.target.value
                                    )
                                }
                                variant="outlined"
                            />
                            <TextField
                                id="email"
                                label="Email"
                                name="email"
                                value={profile.email}
                                type="email"
                                onChange={(e) =>
                                    handleInputChange('email', e.target.value)
                                }
                                variant="outlined"
                            />
                            <TextField
                                id="phone"
                                label="Телефон"
                                name="phone"
                                value={profile.phone}
                                type="tel"
                                onChange={(e) =>
                                    handleInputChange('phone', e.target.value)
                                }
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
                <ProfileChangePasswordDialog onSubmit={handlePasswordChange} />
            </Grid>
        </Page>
    );
};

export default ProfilePage;
