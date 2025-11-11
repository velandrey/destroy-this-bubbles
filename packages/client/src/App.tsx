import Game from 'game/components/Game';
import { useState } from 'react';

const App = () => {
    const [value, setValue] = useState('');

    return (
        <>
            <Game></Game>
        </>
    );
};

export default App;
