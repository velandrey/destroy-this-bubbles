import { useGeolocation } from '@hooks/useGeolocation';

import styles from './style.module.scss';

export default function LocationWidget() {
    const { position, error } = useGeolocation({
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
    });

    if (error) return <div>Ошибка: {error.message}</div>;
    if (!position) return <div>Получаю координаты…</div>;

    return (
        <div className={styles.locationWidget}>
            <div>Широта: {position.coords.latitude}</div>
            <div>Долгота: {position.coords.longitude}</div>
            <div>Точность: {position.coords.accuracy}</div>
        </div>
    );
}
