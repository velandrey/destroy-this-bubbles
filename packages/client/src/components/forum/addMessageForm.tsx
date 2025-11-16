import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { TAddMessageFormProps } from '@pages/forum/types';
import { useState } from 'react';

const AddMessageForm = ({ open, onClose, onAdd }: TAddMessageFormProps) => {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        onAdd(text);
        setText('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Добавить сообщение</DialogTitle>
            <DialogContent>
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

export default AddMessageForm;
