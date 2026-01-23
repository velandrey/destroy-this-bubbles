import { useEffect, useState, useRef } from 'react';

export function useGeolocation(options?: PositionOptions) {
    const [position, setPosition] = useState<GeolocationPosition | null>(null);
    const [error, setError] = useState<GeolocationPositionError | null>(null);
    const watchId = useRef<number | null>(null);

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setError({
                code: 0,
                message: 'Geolocation API не поддерживается этим браузером',
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3,
            });
            return;
        }

        watchId.current = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition(pos);
                setError(null);
            },
            (err) => {
                setError(err);
            },
            options
        );

        return () => {
            if (watchId.current !== null) {
                navigator.geolocation.clearWatch(watchId.current);
            }
        };
    }, [options]);

    return { position, error };
}
