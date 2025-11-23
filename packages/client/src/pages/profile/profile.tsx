import { Form, TInputsMap } from '@components/form';
import { Page } from '@components/page';
import ProfileAvatarUpload from '@components/profileAvatarUpload/profileAvatarUpload';
import ProfileChangePasswordDialog from '@components/profileChangePasswordDialog/profileChangePasswordDialog';
import { defaultAvatar } from '@constants/constants';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useLoading } from '@hooks/useLoading';
import { useNotification } from '@hooks/useNotification';
import { useProfile } from '@hooks/useProfile';
import { Button, Grid } from '@mui/material';
import { TProfile } from '@pages/profile/types';
import { updateUser } from '@store/slices/userSlice';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PROFILE_INPUTS, PROFILE_SCHEMA } from './constants';
import styles from './styles.module.scss';

const ProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { startLoading, stopLoading } = useLoading();
    const { showSuccess, showError } = useNotification();
    const { user } = useAppSelector((state) => state.user);
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
        startLoading('Сохранение изменений...');
        try {
            const result = await changeProfile({
                first_name: data.first_name,
                second_name: data.second_name,
                display_name: data.display_name,
                phone: data.phone,
                login: data.login,
                email: data.email,
            });
            if (result) {
                dispatch(
                    updateUser({
                        first_name: data.first_name,
                        second_name: data.second_name,
                        display_name: data.display_name,
                        phone: data.phone,
                        login: data.login,
                        email: data.email,
                    })
                );
                showSuccess('Данные профиля успешно изменены');
            } else {
                showError('Ошибка изменения профиля');
            }
        } finally {
            stopLoading();
        }
    };

    const handlePasswordChange = async (
        oldPassword: string,
        newPassword: string
    ) => {
        const result = await changePassword({
            oldPassword: oldPassword,
            newPassword: newPassword,
        });
        if (result) {
            showSuccess('Пароль успешно изменён');
        } else {
            showError('Ошибка изменения пароля');
        }
    };

    useEffect(() => {
        if (user) {
            setProfile(user);
            if (user.avatar) {
                setAvatarUrl(user.avatar);
            }
        } else {
            getUserData();
        }
    }, [user]);

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
                <ProfileAvatarUpload currentAvatar={avatarUrl} size={120} />
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
