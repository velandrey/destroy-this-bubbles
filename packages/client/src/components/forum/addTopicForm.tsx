import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { TAddTopicFormProps } from '@pages/forum/types';
import { useState } from 'react';

const AddTopicForm = ({ open, onClose, onAdd }: TAddTopicFormProps) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = () => {
        onAdd(title, text);
        setTitle('');
        setText('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Добавить тему</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Заголовок"
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Текст"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Добавить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTopicForm;
