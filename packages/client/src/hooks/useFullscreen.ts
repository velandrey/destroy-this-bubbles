import { useCallback, useEffect, useState } from 'react';

export function useFullscreen<T extends HTMLElement = HTMLElement>() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const onChange = () =>
            setIsFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);

    const enter = useCallback(async (target: T | null) => {
        if (!target)
            return Promise.reject(
                new Error('Нет элемента для вывода на полный экран')
            );
        return target.requestFullscreen();
    }, []);

    const exit = useCallback(async () => {
        if (!document.fullscreenElement) return;
        return document.exitFullscreen();
    }, []);

    return { isFullscreen, enter, exit } as const;
}
