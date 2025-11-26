import { Form, TInputsMap } from '@components/form';
import { Page } from '@components/page';
import ProfileAvatarUpload from '@components/profileAvatarUpload/profileAvatarUpload';
import ProfileChangePasswordDialog from '@components/profileChangePasswordDialog/profileChangePasswordDialog';
import { StatusAlert } from '@components/statusAlert';
import { defaultAvatar } from '@constants/constants';
import { ROUTES } from '@constants/routes';
import { useProfile } from '@hooks/useProfile';
import { Button, Grid } from '@mui/material';
import { TProfile } from '@pages/profile/types';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PROFILE_INPUTS, PROFILE_SCHEMA } from './constants';
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
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
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

    const getProfileData = async () => {
        try {
            const profile = await getUserData();
            setProfile(profile);
            if (profile.avatar) {
                setAvatarUrl(profile.avatar);
            }
        } catch (err) {
            setAlertOpen(true);
            setAlertMessage('Не удалось получить данные профиля');
            console.log(err);
        }
    };

    const handleProfileChange = async (data: Record<string, string>) => {
        const result = await changeProfile({
            first_name: data.first_name,
            second_name: data.second_name,
            display_name: data.display_name,
            phone: data.phone,
            login: data.login,
            email: data.email,
        });
        setAlertOpen(true);
        if (result) {
            setAlertMessage('Данные профиля успешно изменены');
        } else {
            setAlertMessage('Ошибка изменения профиля');
        }
    };

    const handleAvatarChange = async () => {
        await getProfileData();
    };

    const handlePasswordChange = async (
        oldPassword: string,
        newPassword: string
    ) => {
        const result = await changePassword({
            oldPassword: oldPassword,
            newPassword: newPassword,
        });
        setAlertOpen(true);
        if (result) {
            setAlertMessage('Пароль успешно изменён');
        } else {
            setAlertMessage('Ошибка изменения пароля');
        }
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
                onClick={() => navigate(ROUTES.MENU)}
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
                <Form
                    submitBtnLabel="Сохранить изменения"
                    inputs={inputs}
                    schema={PROFILE_SCHEMA}
                    submitHandler={handleProfileChange}
                    className={styles.formContainer}
                />
                <ProfileChangePasswordDialog onSubmit={handlePasswordChange} />
            </Grid>
            <StatusAlert
                open={alertOpen}
                message={alertMessage}
                severity="success"
                onClose={() => setAlertOpen(false)}
            />
        </Page>
    );
};

export default ProfilePage;
