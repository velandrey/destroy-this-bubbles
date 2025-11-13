import './style.scss';
import ProfileAvatarUpload from '@components/profileAvatarUpload';
import ProfileButton from '@components/profileButton';
import ProfileChangePasswordDialog from '@components/profileChangePasswordDialog';
import ProfileFormField from '@components/profileFormField';
import { defaultAvatar, IProfile } from '@constants/profile';
import { useProfile } from '@hooks/useProfile';
import React, { useEffect, useState } from 'react';

const ProfileEdit: React.FC = () => {
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { auth, getUserData, changeProfile, changePassword } = useProfile();

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
            avatar: profile.avatar,
            email: profile.email,
        });
        console.log('Profile saved:', profile);
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
        <div className="profile">
            <h1 className="profile__title">Профиль игрока</h1>

            <ProfileAvatarUpload
                currentAvatar={avatarUrl}
                onAvatarChange={handleAvatarChange}
                size={120}
            />

            <form className="profile__form" onSubmit={handleSubmit}>
                <ProfileFormField
                    label="Имя"
                    name="first_name"
                    value={profile.first_name}
                    onChange={(value) => handleInputChange('first_name', value)}
                    type="text"
                />

                <ProfileFormField
                    label="Фамилия"
                    name="second_name"
                    value={profile.second_name}
                    onChange={(value) =>
                        handleInputChange('second_name', value)
                    }
                    type="text"
                />

                <ProfileFormField
                    label="Никнейм"
                    name="display_name"
                    value={profile.display_name}
                    onChange={(value) =>
                        handleInputChange('display_name', value)
                    }
                    type="text"
                />

                <ProfileFormField
                    label="Email"
                    name="email"
                    value={profile.email}
                    onChange={(value) => handleInputChange('email', value)}
                    type="email"
                />

                <ProfileFormField
                    label="Телефон"
                    name="phone"
                    value={profile.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                    type="tel"
                />

                <div className="profile__submit_row">
                    <ProfileButton type="submit" className="profile__submit">
                        Сохранить изменения
                    </ProfileButton>
                </div>
            </form>

            <a
                href="javascript:;"
                className="profile__change-password"
                onClick={() => setIsDialogOpen(true)}
            >
                Изменить пароль
            </a>
            <ProfileChangePasswordDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handlePasswordChange}
            />
        </div>
    );
};

export default ProfileEdit;
