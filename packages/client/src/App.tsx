import { selectUser } from '@slices/userSlice';
import { useSelector } from './store';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

const App = () => {
    const [value, setValue] = useState('');

    return (
        <div>
            <Button variant="contained" color="primary">
                Click me
            </Button>
            <br />
            <br />
            <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <br />
            <br />
            <TextField
                id="filled-basic"
                label="Filled"
                variant="filled"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <br />
            <br />
            <TextField
                id="standard-basic"
                label="Standard"
                variant="standard"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
};

export default App;
