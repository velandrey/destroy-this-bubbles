import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';

import { SiteTheme, SiteThemeCreationAttributes } from './models/SiteTheme';
import { UserTheme } from './models/UserTheme';

const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
} = process.env;

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: POSTGRES_HOST || 'postgres',
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER || 'postgres',
    password: POSTGRES_PASSWORD || 'postgres',
    database: POSTGRES_DB || 'postgres',
    logging: false,
    models: [SiteTheme, UserTheme],
});

const SITE_THEMES: SiteThemeCreationAttributes[] = [
    { theme: 'light', description: 'светлая тема' },
    { theme: 'dark', description: 'темная тема' },
];

export const createClientAndConnect = async (): Promise<Sequelize | null> => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('  ➜ 🎸 Connected to the database via Sequelize');
        return sequelize;
    } catch (e) {
        console.error('Ошибка БД:', e);
    }

    return null;
};

export const ensureSiteThemes = async (): Promise<void> => {
    await sequelize.transaction(async (transaction) => {
        for (const row of SITE_THEMES) {
            const [_, created] = await SiteTheme.findOrCreate({
                where: { theme: row.theme },
                defaults: row,
                transaction,
            });

            if (created) {
                console.log(`  ➜ 🎨 Theme created: ${row.theme}`);
            } else {
                console.log(`  ➜ 🎨 Theme already exists: ${row.theme}`);
            }
        }
    });
};

export const logSiteThemes = async (): Promise<void> => {
    const rows = await SiteTheme.findAll({
        order: [['theme', 'ASC']],
    });

    const summary = rows.map((row) => `${JSON.stringify(row)}`).join(', ');
    console.log(`  ➜ 🎨 Site themes: ${summary}`);
};

export const upsertUserTheme = async (
    userId: number,
    themeId: number
): Promise<void> => {
    const theme = await SiteTheme.findByPk(themeId);
    if (!theme) {
        const deleted = await UserTheme.destroy({ where: { userId } });
        if (deleted > 0) {
            console.log(
                `  ➜ 🎨 Theme not found, removed user theme: user_id=${userId}`
            );
        } else {
            console.log(
                `  ➜ 🎨 Theme not found, no user theme to remove: user_id=${userId}`
            );
        }
        return;
    }

    const [_row, created] = await UserTheme.upsert({ userId, themeId });
    if (created) {
        console.log(
            `  ➜ 🎨 User theme created: user_id=${userId}, theme_id=${themeId}`
        );
    } else {
        console.log(
            `  ➜ 🎨 User theme updated: user_id=${userId}, theme_id=${themeId}`
        );
    }
};

export const getThemeByUserId = async (
    userId: number
): Promise<string | null> => {
    const row = await UserTheme.findOne({
        where: { userId },
        include: [
            {
                model: SiteTheme,
                attributes: ['theme'],
            },
        ],
    });

    return row?.theme?.theme ?? null;
};
