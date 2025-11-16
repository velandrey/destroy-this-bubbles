export type TTopic = {
    id: number;
    title: string;
    author: string;
    date: string;
    messages: TMessage[];
};

export type TMessage = {
    id: number;
    text: string;
    author: string;
    date: string;
};

export type TGroup = {
    id: number;
    name: string;
    topics: TTopic[];
};

export type TAddMessageFormProps = {
    open: boolean;
    onClose: () => void;
    onAdd: (text: string) => void;
};

export type TAddTopicFormProps = {
    open: boolean;
    onClose: () => void;
    onAdd: (title: string, text: string) => void;
};

export type TMessageItemProps = {
    message: TMessage;
};
