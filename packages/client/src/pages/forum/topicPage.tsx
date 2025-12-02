import React, { useState } from 'react';
import { Button, Pagination, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import AddMessageForm from '@components/forum/addMessageForm';
import MessageItem from '@components/forum/messageItem';
import { Page } from '@components/page';

import { mockDataMessages } from './mockData';
import { TMessage } from './types';
import styles from './styles.module.scss';

const TopicPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [messages, setMessages] = useState<TMessage[]>(mockDataMessages);
    const [page, setPage] = useState(1);
    const [addMessageOpen, setAddMessageOpen] = useState(false);
    const messagesPerPage = 3;

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    const handleAddMessage = () => {
        setAddMessageOpen(true);
    };

    const handleAddMessageSubmit = (text: string) => {
        const now = new Date().toLocaleString();
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                text,
                author: 'Current User',
                date: now,
            },
        ]);
    };

    const paginatedMessages = messages.slice(
        (page - 1) * messagesPerPage,
        page * messagesPerPage
    );

    return (
        <Page className={styles.container}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/forum')}
                sx={{ mb: 2 }}
            >
                Назад к форуму
            </Button>
            <Typography variant="h4" gutterBottom>
                Тема {id}
            </Typography>
            {paginatedMessages.map((message) => (
                <MessageItem key={message.id} message={message} />
            ))}
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddMessage}
                sx={{ mt: 1, mb: 1 }}
            >
                Добавить сообщение
            </Button>
            <Pagination
                count={Math.ceil(messages.length / messagesPerPage)}
                page={page}
                onChange={handlePageChange}
                sx={{ mt: 2 }}
            />
            <AddMessageForm
                open={addMessageOpen}
                onClose={() => setAddMessageOpen(false)}
                onAdd={handleAddMessageSubmit}
            />
        </Page>
    );
};

export default TopicPage;
