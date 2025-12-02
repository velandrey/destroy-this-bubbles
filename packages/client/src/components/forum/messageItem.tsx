import { Typography, Paper } from '@mui/material';
import { TMessageItemProps } from '@pages/forum/types';

const MessageItem = ({ message }: TMessageItemProps) => {
    return (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Автор: {message.author} | Дата: {message.date}
            </Typography>
            <Typography variant="body1">{message.text}</Typography>
        </Paper>
    );
};

export default MessageItem;
