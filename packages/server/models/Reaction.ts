import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/db';

export type ReactionType = 'like' | 'dislike' | 'love' | 'angry' | 'laugh';

interface ReactionAttributes {
    id: number;
    type: ReactionType;
    userId: number;
    commentId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type ReactionCreationAttributes = Optional<
    ReactionAttributes,
    'id' | 'createdAt' | 'updatedAt'
>;

export class Reaction
    extends Model<ReactionAttributes, ReactionCreationAttributes>
    implements ReactionAttributes
{
    public id!: number;
    public type!: ReactionType;
    public userId!: number;
    public commentId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Reaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.ENUM('like', 'dislike', 'love', 'angry', 'laugh'),
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'comment_id',
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
        tableName: 'reactions',
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'comment_id'],
            },
        ],
    }
);
