import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { Avatar, Button, Stack, Box } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// will be replaced by api logic
import { getMockData, type TLeaderBoardItem } from './mockData';
import styles from './styles.module.scss';

type TData = TLeaderBoardItem[];

// mock for getting chunkSize elements per request
const chunkSize = 5;
// need authorization and api for this logic - just mock for now
const currentPlayerRank = 6;

const LeaderboardRow = ({
    rank,
    displayName,
    points,
    avatarSrc,
}: TLeaderBoardItem & { rank: number }) => (
    <Box
        className={`
            ${styles.row}
            ${currentPlayerRank === rank ? styles.currentPlayer : ''}
            ${rank <= 3 ? styles.greatRank : ''}
        `}
    >
        <p className={styles.rank}>#{rank}</p>
        <Avatar alt={displayName} src={avatarSrc} className={styles.avatar} />
        <p className={styles.name}>{displayName}</p>
        <p className={styles.points}>{points} pts</p>
    </Box>
);

const LeaderBoardPage = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([] as TData);
    const listRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setData(getMockData(0, chunkSize));
    }, []);

    const loadMore = useCallback(() => {
        setData((prev) => {
            // may be hasmore logic will be implemented in api
            // for now get the data and check if has elements
            const nextPart = getMockData(prev.length, chunkSize);
            if (nextPart.length === 0) {
                return prev;
            }

            return [...prev, ...nextPart];
        });
    }, []);

    useEffect(() => {
        const container = listRef.current;
        const bottomMarker = bottomRef.current;
        if (!container || !bottomMarker) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    loadMore();
                }
            },
            {
                root: container,
                threshold: 1,
            }
        );

        observer.observe(bottomMarker);

        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <Page className={styles.container}>
            <h1>Таблица победителей</h1>
            <h2>Твой ранк - #{currentPlayerRank}</h2>
            <Stack spacing={1} className={styles.table} ref={listRef}>
                {data.map((item) => (
                    <LeaderboardRow key={item.rank} {...item} />
                ))}
                <div
                    id="bottom"
                    ref={bottomRef}
                    className={styles.bottomMarker}
                />
            </Stack>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(ROUTES.MENU)}
            >
                Назад к меню
            </Button>
        </Page>
    );
};

export default LeaderBoardPage;
