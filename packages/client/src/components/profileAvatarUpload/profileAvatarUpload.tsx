import { defaultAvatar } from '@constants/constants';
import { useNotification } from '@hooks/useNotification';
import { useProfile } from '@hooks/useProfile';
import React, { useRef } from 'react';

import styles from './styles.module.scss';

type TProfileAvatarUploadProps = {
    currentAvatar?: string;
    size?: number;
};

const ProfileAvatarUpload: React.FC<TProfileAvatarUploadProps> = ({
    currentAvatar,
    size = 120,
}) => {
    const { showSuccess, showError } = useNotification();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };
    const { changeAvatar, getUserData } = useProfile();

    const handleAvatarChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) {
            showError('Выберите изображение!');
            return;
        }
        try {
            const isUpdated = await changeAvatar(file);
            if (isUpdated) {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                await getUserData();
                showSuccess('Аватар успешно изменён!');
            }
        } catch (error) {
            showError('Не удалось загрузить аватар');
        }
    };

    return (
        <div
            className={styles.avatar__container}
            style={{ width: size, height: size }}
        >
            <div className={styles.avatar__box} onClick={handleAvatarClick}>
                <img
                    src={currentAvatar || defaultAvatar}
                    alt="Аватар профиля"
                    className={styles.avatar__image}
                />

                <div className={styles.avatar__overlay}>
                    <img
                        src="/images/profile/upload_image.svg"
                        alt="Изменить аватар"
                        className={styles.avatar__overlay_image}
                    />
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.avatar__fileInput}
            />
        </div>
    );
};

export default ProfileAvatarUpload;
