import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_PORT,
} = process.env;

export const sequelize = new Sequelize(
    POSTGRES_DB || 'postgres',
    POSTGRES_USER || 'postgres',
    POSTGRES_PASSWORD || 'postgres',
    {
        host: POSTGRES_HOST,
        port: Number(POSTGRES_PORT),
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Соединение с БД установлено.');

        await sequelize.sync({ alter: false });
        console.log('Модельки синхронизированы.');
    } catch (error) {
        console.error('Ошибка подключения к БД:', error);
        process.exit(1);
    }
};
