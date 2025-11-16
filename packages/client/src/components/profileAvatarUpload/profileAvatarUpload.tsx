import { StatusAlert } from '@components/statusAlert';
import { defaultAvatar } from '@constants/constants';
import { useProfile } from '@hooks/useProfile';
import React, { useRef, useState } from 'react';

import styles from './styles.module.scss';

type TProfileAvatarUploadProps = {
    currentAvatar?: string;
    onAvatarChange?: () => void;
    size?: number;
};

const ProfileAvatarUpload: React.FC<TProfileAvatarUploadProps> = ({
    currentAvatar,
    onAvatarChange,
    size = 120,
}) => {
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };
    const { changeAvatar } = useProfile();

    const handleAvatarChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) {
            setAlertOpen(true);
            setAlertMessage('Выберите изображение!');
            return;
        }
        try {
            const isUpdated = await changeAvatar(file);
            if (isUpdated && onAvatarChange) {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                onAvatarChange();
            }
        } catch (error) {
            setAlertOpen(true);
            setAlertMessage('Не удалось загрузить аватар');
            console.error('Ошибка загрузки аватара:', error);
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
            <StatusAlert
                open={alertOpen}
                message={alertMessage}
                severity="success"
                onClose={() => setAlertOpen(false)}
            />
        </div>
    );
};

export default ProfileAvatarUpload;
