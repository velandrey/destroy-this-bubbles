import { Box, Button, SxProps, TextField } from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

type TInput = {
    inputName: string;
    inputLabel: string;
    placeholder?: string;
};

type TFormProps = {
    submitBtnLabel: string;
    resetBtnLabel?: string;
    inputs: TInput[];
    onSubmit: (data: Record<string, string | File | null>) => void;
    inputsVariant?: 'outlined' | 'filled' | 'standard';
    sx?: SxProps;
};

const Form = (props: TFormProps) => {
    const {
        submitBtnLabel,
        resetBtnLabel,
        inputs,
        onSubmit,
        sx,
        inputsVariant,
    } = props;

    const defaultSx = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
    };

    const initialState = useMemo(
        () => Object.fromEntries(inputs.map((input) => [input.inputName])),
        [inputs]
    );

    const [formData, setFormData] =
        useState<Record<string, string | File | null>>(initialState);
    const [hasChanged, setHasChanged] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        setHasChanged(true);
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
            sx={sx || defaultSx}
        >
            {inputs.map(({ inputName, inputLabel, placeholder }) => {
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
                    />
                );
            })}

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
