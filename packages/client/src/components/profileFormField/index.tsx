import React from 'react';
import './style.scss';

interface IFormFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    type: 'text' | 'email' | 'tel' | 'password';
}

const ProfileFormField: React.FC<IFormFieldProps> = ({
    label,
    name,
    value,
    onChange,
    type,
}) => {
    return (
        <div className="form-field">
            <label className="form-field__label">{label}</label>
            <input
                className="form-field__input"
                type={type}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default ProfileFormField;
