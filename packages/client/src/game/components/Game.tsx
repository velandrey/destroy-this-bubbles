import { useAppSelector } from '@hooks/redux';
import { TGameResults } from '@store/slices/gameSlice';
import { useEffect, useRef } from 'react';

import { GameEngine } from '../../game/engine/GameEngine';

export type TOnGameOverHandler = (results: TGameResults) => void;

type TGameEnterProps = {
    onGameOver: TOnGameOverHandler;
};

function GameEnter({ onGameOver }: TGameEnterProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameSettings = useAppSelector((state) => state.game.settings);

    useEffect(() => {
        if (!canvasRef.current) return;

        const engine = new GameEngine(
            canvasRef.current,
            onGameOver,
            gameSettings
        );
        engine.start();

        return () => {
            engine.destroy();
        };
    }, []);

    return <canvas ref={canvasRef} width={800} height={600} />;
}

export default GameEnter;
