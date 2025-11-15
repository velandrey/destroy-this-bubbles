export type TProfile = {
    id?: number;
    first_name: string;
    second_name: string;
    display_name: string;
    phone: string;
    login: string;
    avatar?: string;
    email: string;
};

export type TPasswordChangeData = {
    oldPassword: string;
    newPassword: string;
};

export type TProfileChangePasswordDialogProps = {
    onSubmit: (oldPassword: string, newPassword: string) => void;
};
