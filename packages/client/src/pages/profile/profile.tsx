import { Page } from '@components/page';
import ProfileAvatarUpload from '@components/profileAvatarUpload/profileAvatarUpload';
import ProfileChangePasswordDialog from '@components/profileChangePasswordDialog/profileChangePasswordDialog';
import ProfileForm from '@components/profileForm/profileForm';
import { defaultAvatar } from '@constants/constants';
import { useProfile } from '@hooks/useProfile';
import { Button, Grid } from '@mui/material';
import { TProfile } from '@pages/profile/types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<TProfile>({
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

    const handleInputChange = (field: keyof TProfile, value: string) => {
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
        alert('Данные профиля успешно изменены');
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
        alert('Пароль успешно изменён');
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
            <Grid container className={styles.profile__grid}>
                <h1>Профиль игрока</h1>
                <ProfileAvatarUpload
                    currentAvatar={avatarUrl}
                    onAvatarChange={handleAvatarChange}
                    size={120}
                />
                <ProfileForm
                    profile={profile}
                    onSubmit={handleSubmit}
                    onInputChange={handleInputChange}
                />
                <ProfileChangePasswordDialog onSubmit={handlePasswordChange} />
            </Grid>
        </Page>
    );
};

export default ProfilePage;
