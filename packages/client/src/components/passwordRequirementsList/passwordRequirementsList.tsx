import { PasswordRequirement } from '@hooks/usePasswordValidation';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import React from 'react';

import styles from './styles.module.scss';

type TPasswordRequirementsListProps = {
    requirements: PasswordRequirement[];
    title?: string;
};

const PasswordRequirementsList: React.FC<TPasswordRequirementsListProps> = ({
    requirements,
    title = 'Требования к паролю:',
}) => {
    return (
        <Box className={styles.pass_req__box}>
            <Typography variant="subtitle2" gutterBottom>
                {title}
            </Typography>
            <List className={styles.prl__list}>
                {requirements.map((requirement, index) => (
                    <ListItem key={index} className={styles.prl__list_item}>
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
