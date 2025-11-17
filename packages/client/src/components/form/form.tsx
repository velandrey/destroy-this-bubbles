import { valibotResolver } from '@hookform/resolvers/valibot';
import { Box, Button, TextField } from '@mui/material';
import { useEffect, useMemo } from 'react';
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
            config.defaultValue?.trim() ?? '',
        ]);
        return Object.fromEntries(configs) as DefaultValues<TValues>;
    }, [inputs]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty, dirtyFields, touchedFields, submitCount },
    } = useForm<TValues>({
        defaultValues,
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        resolver: valibotResolver(schema),
    });

    const values = watch();

    const isSameAsDefault = (name: keyof TValues) => {
        return (
            values[name] === defaultValues[name] &&
            defaultValues[name].length > 0
        );
    };

    const shouldShowError = (name: Path<TValues>) => {
        if (!errors[name]) return false;

        const touched = (
            touchedFields as Partial<Record<Path<TValues>, boolean>>
        )[name];
        const dirty = (dirtyFields as Partial<Record<Path<TValues>, boolean>>)[
            name
        ];
        const changed = !isSameAsDefault(name);

        return changed && (submitCount > 0 || touched || dirty);
    };

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const handleReset = () => {
        reset(defaultValues, {
            keepErrors: false,
            keepDirty: false,
            keepTouched: false,
        });
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
                const showError = shouldShowError(inputName);

                return (
                    <TextField
                        fullWidth
                        key={name}
                        label={config.label}
                        placeholder={config.placeholder ?? ''}
                        type={config.type ?? 'text'}
                        variant={inputsVariant || 'outlined'}
                        {...register(inputName)}
                        error={showError}
                        helperText={
                            showError
                                ? (errors[inputName]?.message as string)
                                : ''
                        }
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
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
