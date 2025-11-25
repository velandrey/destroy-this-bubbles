import React from 'react';
import { useEffect, useRef } from 'react';

import { GameEngine } from '../engine/GameEngine';

const Game: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const engine = new GameEngine(canvasRef.current);
        engine.start();
    }, []);

    return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Game;
