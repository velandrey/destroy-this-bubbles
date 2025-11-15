import { PasswordRequirement } from '@hooks/usePasswordValidation';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import React from 'react';

interface PasswordRequirementsListProps {
    requirements: PasswordRequirement[];
    title?: string;
}

const PasswordRequirementsList: React.FC<PasswordRequirementsListProps> = ({
    requirements,
    title = 'Требования к паролю:',
}) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
                {title}
            </Typography>
            <List sx={{ py: 0 }}>
                {requirements.map((requirement, index) => (
                    <ListItem key={index} sx={{ p: 0 }}>
                        <ListItemText
                            primary={'• ' + requirement.text}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    color: requirement.isValid
                                        ? 'success.main'
                                        : 'text.secondary',
                                },
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default PasswordRequirementsList;
