import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/db';

interface TopicAttributes {
    id: number;
    title: string;
    content: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type TopicCreationAttributes = Optional<
    TopicAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;

export class Topic
    extends Model<TopicAttributes, TopicCreationAttributes>
    implements TopicAttributes
{
    public id!: number;
    public title!: string;
    public content!: string;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Topic.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    },
    {
        sequelize,
        tableName: 'topics',
        underscored: true,
    }
);
