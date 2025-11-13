import styles from './styles.module.scss';

type TProps = {
    countdown: number;
};

const GamePageCountdown = ({ countdown }: TProps) => {
    return (
        <div className={styles.container}>
            <div key={countdown} className={styles.number}>
                {countdown}
            </div>
        </div>
    );
};

export default GamePageCountdown;
