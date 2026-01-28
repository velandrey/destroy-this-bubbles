import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/db';

interface CommentAttributes {
    id: number;
    content: string;
    userId: number;
    topicId: number;
    parentId?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

type CommentCreationAttributes = Optional<
    CommentAttributes,
    'id' | 'parentId' | 'createdAt' | 'updatedAt'
>;

export class Comment
    extends Model<CommentAttributes, CommentCreationAttributes>
    implements CommentAttributes
{
    public id!: number;
    public content!: string;
    public userId!: number;
    public topicId!: number;
    public parentId?: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        topicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'topic_id',
            references: {
                model: 'topics',
                key: 'id',
            },
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'parent_id',
            references: {
                model: 'comments',
                key: 'id',
            },
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
        tableName: 'comments',
        underscored: true,
    }
);
