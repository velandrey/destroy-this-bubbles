import { valibotResolver } from '@hookform/resolvers/valibot';
import { Box, Button, TextField } from '@mui/material';
import { useMemo } from 'react';
import { DefaultValues, Path, useForm } from 'react-hook-form';

import { TFormProps, TFormValues, TInputsMap } from './types';

const Form = <T extends TInputsMap>({
    inputs,
    schema,
    submitBtnLabel,
    resetBtnLabel,
    submitHandler,
    resetHandler,
    inputsVariant,
    className,
}: TFormProps<T>) => {
    type TValues = TFormValues<T>;
    const defaultValues = useMemo(() => {
        const configs = Object.entries(inputs).map(([name, config]) => [
            name,
            config.defaultValue,
        ]);
        return Object.fromEntries(configs) as DefaultValues<TValues>;
    }, [inputs]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<TValues>({
        defaultValues,
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        resolver: valibotResolver(schema),
    });

    const handleReset = () => {
        reset(defaultValues);
        resetHandler?.();
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(submitHandler)}
            onReset={handleReset}
            className={className}
        >
            {Object.entries(inputs).map(([name, config]) => {
                const inputName = name as Path<TValues>;
                return (
                    <TextField
                        fullWidth
                        key={name}
                        label={config.label}
                        placeholder={config.placeholder ?? ''}
                        type={config.type ?? 'text'}
                        variant={inputsVariant || 'outlined'}
                        {...register(inputName)}
                        error={!!errors[inputName]}
                        helperText={errors[inputName]?.message as string}
                        sx={{ mb: '0.5rem' }}
                    />
                );
            })}

            <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={!isDirty}
            >
                {submitBtnLabel}
            </Button>
            {resetBtnLabel && (
                <Button
                    type="reset"
                    variant="contained"
                    color="error"
                    disableElevation
                    disabled={!isDirty}
                >
                    {resetBtnLabel}
                </Button>
            )}
        </Box>
    );
};

export default Form;
