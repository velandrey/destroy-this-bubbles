import React, { useState } from 'react';
import { ROUTES } from '@constants/routes';
import {
    Button,
    Card,
    CardContent,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AddTopicForm from '@components/forum/addTopicForm';
import { Page } from '@components/page';

import { mockDataGroups } from './mockData';
import { TGroup } from './types';
import styles from './styles.module.scss';

const ForumPage = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<TGroup[]>(mockDataGroups);
    const [addTopicOpen, setAddTopicOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    const handleAddTopic = (groupId: number) => {
        setSelectedGroupId(groupId);
        setAddTopicOpen(true);
    };

    const handleAddTopicSubmit = (title: string, text: string) => {
        if (selectedGroupId) {
            const now = new Date().toLocaleString();
            setGroups((prev) =>
                prev.map((group) =>
                    group.id === selectedGroupId
                        ? {
                              ...group,
                              topics: [
                                  ...group.topics,
                                  {
                                      id: Date.now(),
                                      title,
                                      author: 'Current User',
                                      date: now,
                                      messages: [
                                          {
                                              id: Date.now(),
                                              title,
                                              text,
                                              author: 'Current User',
                                              date: now,
                                          },
                                      ],
                                  },
                              ],
                          }
                        : group
                )
            );
        }
    };

    const handleTopicClick = (topicId: number) => {
        navigate(`/forum/topic/${topicId}`);
    };

    return (
        <Page className={styles.container}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(ROUTES.MENU)}
                sx={{ mb: 2 }}
            >
                Назад
            </Button>
            <Typography variant="h4" gutterBottom>
                Форум
            </Typography>
            {groups.map((group) => (
                <Card key={group.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {group.name}
                        </Typography>
                        <List>
                            {group.topics.map((topic) => (
                                <React.Fragment key={topic.id}>
                                    <ListItemButton
                                        onClick={() =>
                                            handleTopicClick(topic.id)
                                        }
                                    >
                                        <ListItemText
                                            primary={topic.title}
                                            secondary={`Автор: ${topic.author} | Дата: ${topic.date}`}
                                        />
                                    </ListItemButton>
                                    <Divider component="div" />
                                </React.Fragment>
                            ))}
                        </List>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddTopic(group.id)}
                            sx={{ mt: 2 }}
                        >
                            Добавить тему
                        </Button>
                    </CardContent>
                </Card>
            ))}
            <AddTopicForm
                open={addTopicOpen}
                onClose={() => setAddTopicOpen(false)}
                onAdd={handleAddTopicSubmit}
            />
        </Page>
    );
};

export default ForumPage;
