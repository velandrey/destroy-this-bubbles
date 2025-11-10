import { selectUser } from '@slices/userSlice';
import { useSelector } from './store';
import { Button } from '@mui/material';

const App = () => {
    const user = useSelector(selectUser);

    return (
        <div>
            <Button variant="contained" color="primary">
                Click me
            </Button>
            {user ? (
                <div>
                    <p>{user.name}</p>
                    <p>{user.secondName}</p>
                </div>
            ) : (
                <p>Пользователь не найден!</p>
            )}
        </div>
    );
};

export default App;
