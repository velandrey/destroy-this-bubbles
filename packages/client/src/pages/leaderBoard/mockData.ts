export type TLeaderBoardItem = {
    avatarSrc: string;
    displayName: string;
    points: number;
    rank: number;
};

export const mockData: TLeaderBoardItem[] = [
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=200&q=80',
        displayName: 'BubbleHunter',
        points: 820,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80',
        displayName: 'PopMaster',
        points: 510,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1537151625747-768eb6cf92b6?auto=format&fit=crop&w=200&q=80',
        displayName: 'ClickStorm',
        points: 295,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80',
        displayName: 'SpeedTap',
        points: 970,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=200&q=80',
        displayName: 'VirusBuster',
        points: 655,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80',
        displayName: 'BubbleMonk',
        points: 610,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?auto=format&fit=crop&w=200&q=80',
        displayName: 'SwipeNova',
        points: 575,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        displayName: 'PixelPunk',
        points: 540,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        displayName: 'TapQueen',
        points: 520,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
        displayName: 'BurstPilot',
        points: 505,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=200&q=80',
        displayName: 'ZapWizard',
        points: 480,
    },
    {
        avatarSrc:
            'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&q=80',
        displayName: 'ClickBot',
        points: 455,
    },
]
    .sort((a, b) => b.points - a.points)
    .map((item, index) => ({ ...item, rank: index + 1 }));

export function getMockData(
    lastIndex: number,
    chunkSize: number
): TLeaderBoardItem[] {
    return mockData.slice(lastIndex, lastIndex + chunkSize);
}
