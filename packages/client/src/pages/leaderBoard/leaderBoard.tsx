import { Page } from '@components/page';
import { ROUTES } from '@constants/routes';
import { useLeaderboard } from '@hooks/useLeaderboard';
import { useProfile } from '@hooks/useProfile';
import { useUsers } from '@hooks/useUsers';
import { Avatar, Button, Stack, Box } from '@mui/material';
import { TUserSearchResult } from '@store/slices/usersSlice';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

const LeaderboardRow = ({
    rank,
    displayName,
    points,
    avatarSrc,
    isCurrentPlayer,
}: {
    rank: number;
    displayName: string;
    points: number;
    avatarSrc?: string;
    isCurrentPlayer: boolean;
}) => (
    <Box
        className={`
            ${styles.row}
            ${isCurrentPlayer ? styles.currentPlayer : ''}
            ${rank <= 3 ? styles.greatRank : ''}
        `}
    >
        <p className={styles.rank}>#{rank}</p>
        <Avatar alt={displayName} src={avatarSrc} className={styles.avatar} />
        <p className={styles.name}>{displayName}</p>
        <p className={styles.points}>{points} pts</p>
    </Box>
);

const buildDisplayName = ({
    userInfo,
    fallback = '',
}: {
    userInfo?: TUserSearchResult;
    fallback?: string;
}) => {
    let nameFromUserInfo;
    if (userInfo) {
        nameFromUserInfo =
            userInfo.display_name ||
            [userInfo.first_name, userInfo.second_name]
                .filter(Boolean)
                .join(' ')
                .trim();
    }
    return nameFromUserInfo || fallback;
};

const LeaderBoardPage = () => {
    const navigate = useNavigate();
    const { getLeaderBoard, records, isLoading, error, hasMore } =
        useLeaderboard();
    const { user: currentUser } = useProfile();
    const { usersByLogin, fetchUsersByLogins } = useUsers();
    const listRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const currentPlayerRank = useMemo(() => {
        if (!currentUser?.login) {
            return null;
        }

        const index = records.findIndex(
            (record) => record.userLogin === currentUser.login
        );

        return index === -1 ? null : index + 1;
    }, [records, currentUser?.login]);

    useEffect(() => {
        void getLeaderBoard({ reset: true }).unwrap();
    }, [getLeaderBoard]);

    const loginsToSearch = useMemo(
        () => records.map((record) => record.userLogin).filter(Boolean),
        [records]
    );

    useEffect(() => {
        if (loginsToSearch.length > 0) {
            void fetchUsersByLogins(loginsToSearch);
        }
    }, [fetchUsersByLogins, loginsToSearch]);

    const loadMore = useCallback(async () => {
        if (hasMore && !isLoading) getLeaderBoard();
    }, [getLeaderBoard, hasMore, isLoading]);

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
                    void loadMore();
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
            {currentPlayerRank && <h2>Твой ранк - #{currentPlayerRank}</h2>}
            <Stack spacing={1} className={styles.table} ref={listRef}>
                {isLoading && <p>Загрузка...</p>}
                {error && <p>{error}</p>}
                {!isLoading &&
                    !error &&
                    records.length > 0 &&
                    records.map((item, index) => {
                        const userInfo = usersByLogin[item.userLogin];
                        const displayName = buildDisplayName({
                            userInfo,
                            fallback: item.userLogin || 'неизвестный игрок',
                        });
                        const avatarSrc = userInfo?.avatar;
                        return (
                            <LeaderboardRow
                                key={item.userLogin || index}
                                rank={index + 1}
                                displayName={displayName}
                                points={item.score}
                                avatarSrc={avatarSrc}
                                isCurrentPlayer={
                                    currentPlayerRank === index + 1
                                }
                            />
                        );
                    })}
                {!isLoading && !error && records.length === 0 && (
                    <p>Пока нет результатов.</p>
                )}
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
