import { SubmitHandler } from 'react-hook-form';
import { BaseSchema } from 'valibot';

type TInput = {
    label: string;
    placeholder?: string;
    type?: 'text' | 'password' | 'email' | 'tel';
    defaultValue?: string;
};

type TInputsMap = Record<string, TInput>;

type TFormValues<T extends TInputsMap> = {
    [K in keyof T]: string;
};

type TFormProps<T extends TInputsMap> = {
    inputs: T;
    schema: BaseSchema<any, TFormValues<T>, any>;
    submitBtnLabel: string;
    resetBtnLabel?: string;
    submitHandler: SubmitHandler<TFormValues<T>>;
    resetHandler?: () => void;
    inputsVariant?: 'outlined' | 'filled' | 'standard';
    className?: string;
};

export type { TInput, TFormProps, TFormValues, TInputsMap };
