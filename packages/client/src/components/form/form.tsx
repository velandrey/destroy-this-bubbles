import { Box, Button, TextField } from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

type TInput = {
    inputName: string;
    inputLabel: string;
    placeholder?: string;
    type?: 'text' | 'password' | 'email' | 'tel';
};

type TFormProps = {
    submitBtnLabel: string;
    resetBtnLabel?: string;
    inputs: TInput[];
    onSubmit: (data: Record<string, string | File | null>) => void;
    inputsVariant?: 'outlined' | 'filled' | 'standard';
    className?: string;
};

const Form = (props: TFormProps) => {
    const {
        submitBtnLabel,
        resetBtnLabel,
        inputs,
        onSubmit,
        inputsVariant,
        className,
    } = props;

    const initialState = useMemo(
        () => Object.fromEntries(inputs.map((input) => [input.inputName, ''])),
        [inputs]
    );

    const [formData, setFormData] =
        useState<Record<string, string>>(initialState);
    const [hasChanged, setHasChanged] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const changed = Object.keys(formData).some(
            (key) => formData[key] !== initialState[key]
        );
        setHasChanged(changed);
    }, [formData, initialState]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleReset = () => {
        setFormData(initialState);
        setHasChanged(false);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            onReset={handleReset}
            className={className}
        >
            {inputs.map(
                ({ inputName, inputLabel, placeholder, type = 'text' }) => {
                    return (
                        <TextField
                            fullWidth
                            key={inputName}
                            name={inputName}
                            label={inputLabel}
                            placeholder={placeholder}
                            value={(formData[inputName] as string) ?? ''}
                            onChange={handleChange}
                            variant={inputsVariant || 'outlined'}
                            type={type}
                        />
                    );
                }
            )}

            <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={!hasChanged}
            >
                {submitBtnLabel}
            </Button>
            {resetBtnLabel && (
                <Button
                    type="reset"
                    variant="contained"
                    color="error"
                    disableElevation
                    disabled={!hasChanged}
                >
                    {resetBtnLabel}
                </Button>
            )}
        </Box>
    );
};

export default Form;
export type { TInput };
