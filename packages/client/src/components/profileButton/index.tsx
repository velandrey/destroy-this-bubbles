import React from 'react';
import './style.scss';

interface IProfileButtonProps {
    type?: 'button' | 'submit';
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    disabled?: boolean;
}

const ProfileButton: React.FC<IProfileButtonProps> = ({
    type = 'button',
    className = '',
    onClick,
    children,
    disabled = false,
}) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick && !disabled) {
            onClick(event);
        }
    };

    return (
        <button
            type={type}
            className={`profile__button ${className}`}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default ProfileButton;
