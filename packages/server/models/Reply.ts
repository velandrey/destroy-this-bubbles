import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../config/db';

interface ReplyAttributes {
    id: number;
    content: string;
    userId: number;
    commentId: number;
    parentReplyId?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

type ReplyCreationAttributes = Optional<
    ReplyAttributes,
    'id' | 'parentReplyId' | 'createdAt' | 'updatedAt'
>;

export class Reply
    extends Model<ReplyAttributes, ReplyCreationAttributes>
    implements ReplyAttributes
{
    public id!: number;
    public content!: string;
    public userId!: number;
    public commentId!: number;
    public parentReplyId?: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Reply.init(
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
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'comment_id',
            references: {
                model: 'comments',
                key: 'id',
            },
        },
        parentReplyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'parent_reply_id',
            references: {
                model: 'replies',
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
        tableName: 'replies',
        underscored: true,
    }
);
