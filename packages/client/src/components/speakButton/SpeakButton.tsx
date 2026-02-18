import React, { useCallback } from 'react';

import { useSpeechSynthesis } from '../../hooks';

type Props = {
    text: string;
    className?: string;
};

export const SpeakButton: React.FC<Props> = ({ text, className }) => {
    const { supported, speak } = useSpeechSynthesis();

    const handleClick = useCallback(() => {
        if (!supported) return;
        if (!text) return;
        speak(text);
    }, [supported, speak, text]);

    return (
        <button type="button" className={className} onClick={handleClick}>
            Oзвучить
        </button>
    );
};

export default SpeakButton;
