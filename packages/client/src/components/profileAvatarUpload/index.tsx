import './style.scss';
import { defaultAvatar } from '@constants/constants';
import { useProfile } from '@hooks/useProfile';
import React, { useRef } from 'react';

interface IProfileAvatarUploadProps {
    currentAvatar?: string;
    onAvatarChange?: () => void;
    size?: number;
}

const ProfileAvatarUpload: React.FC<IProfileAvatarUploadProps> = ({
    currentAvatar,
    onAvatarChange,
    size = 120,
}) => {
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
            alert('Выберите изображение!');
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
            console.error('Ошибка загрузки аватара:', error);
            alert('Не удалось загрузить аватар');
        }
    };

    return (
        <div
            className="avatar__container"
            style={{ width: size, height: size }}
        >
            <div className="avatar__box" onClick={handleAvatarClick}>
                <img
                    src={currentAvatar || defaultAvatar}
                    alt="Аватар профиля"
                    className="avatar__image"
                />

                <div className="avatar__overlay">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="avatar__fileInput"
            />
        </div>
    );
};

export default ProfileAvatarUpload;
