import { GameEngine } from 'game/engine/gameEngine';
import React from 'react';
import { useEffect, useRef } from 'react';



const Game: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const engine = new GameEngine(canvasRef.current);
        engine.start();
        // return () => engine.stop();
    }, []);

    return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Game;
