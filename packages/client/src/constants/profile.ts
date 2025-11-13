export const defaultAvatar = '/images/profile/user.webp';

export interface IProfile {
    id?: number;
    first_name: string;
    second_name: string;
    display_name: string;
    phone: string;
    login: string;
    avatar?: string;
    email: string;
}
