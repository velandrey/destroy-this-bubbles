import { Form, TInputsMap } from '@components/form';
import { Page } from '@components/page';
import ProfileAvatarUpload from '@components/profileAvatarUpload/profileAvatarUpload';
import ProfileChangePasswordDialog from '@components/profileChangePasswordDialog/profileChangePasswordDialog';
import { defaultAvatar } from '@constants/constants';
import { ROUTES } from '@constants/routes';
import { useNotification } from '@hooks/useNotification';
import { useProfile } from '@hooks/useProfile';
import { Button, Grid } from '@mui/material';
import { TProfile } from '@pages/profile/types';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PROFILE_INPUTS, PROFILE_SCHEMA } from './constants';
import styles from './styles.module.scss';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { showSuccess, showError, showNotification } = useNotification();
    const {
        user,
        isLoading: profileLoading,
        getUserData,
        changeProfile,
        changePassword,
    } = useProfile();

    const [profile, setProfile] = useState<TProfile>({
        first_name: '',
        second_name: '',
        display_name: '',
        phone: '',
        login: '',
        avatar: '',
        email: '',
    });

    const inputs: TInputsMap = useMemo(() => {
        return Object.fromEntries(
            Object.entries(PROFILE_INPUTS).map(([name, cfg]) => [
                name,
                {
                    ...cfg,
                    defaultValue: profile[name as keyof TProfile] ?? '',
                },
            ])
        ) as TInputsMap;
    }, [profile]);

    const handleProfileChange = async (data: Record<string, string>) => {
        try {
            showNotification('Сохранение данных...');
            const result = await changeProfile({
                first_name: data.first_name,
                second_name: data.second_name,
                display_name: data.display_name,
                phone: data.phone,
                login: data.login,
                email: data.email,
            }).unwrap();

            showSuccess('Данные профиля успешно изменены');
        } catch (error) {
            showError('Ошибка изменения профиля');
        }
    };

    const handlePasswordChange = async (
        oldPassword: string,
        newPassword: string
    ) => {
        try {
            await changePassword({
                oldPassword,
                newPassword,
            }).unwrap();

            showSuccess('Пароль успешно изменён');
        } catch (error) {
            showError('Ошибка изменения пароля');
        }
    };

    useEffect(() => {
        if (!user) {
            getUserData();
        } else {
            setProfile(user);
        }
    }, [user, getUserData]);

    return (
        <Page>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(ROUTES.MENU)}
                disabled={profileLoading}
            >
                Меню
            </Button>
            <Grid container className={styles.profile__grid}>
                <h1>Профиль игрока</h1>
                <ProfileAvatarUpload
                    currentAvatar={user?.avatar || defaultAvatar}
                    size={120}
                />
                <Form
                    submitBtnLabel="Сохранить изменения"
                    inputs={inputs}
                    schema={PROFILE_SCHEMA}
                    submitHandler={handleProfileChange}
                    className={styles.formContainer}
                />
                <ProfileChangePasswordDialog onSubmit={handlePasswordChange} />
            </Grid>
        </Page>
    );
};

export default ProfilePage;
