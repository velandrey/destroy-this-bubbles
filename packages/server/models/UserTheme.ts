import { Optional } from 'sequelize';
import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

import { SiteTheme } from './SiteTheme';

export interface UserThemeAttributes {
    userId: number;
    themeId: number | null;
}

export type UserThemeCreationAttributes = Optional<UserThemeAttributes, never>;

@Table({
    timestamps: false,
    tableName: 'user_theme',
})
export class UserTheme extends Model<
    UserThemeAttributes,
    UserThemeCreationAttributes
> {
    @PrimaryKey
    @AllowNull(false)
    @Column({ type: DataType.INTEGER, field: 'user_id' })
    declare userId: number;

    @ForeignKey(() => SiteTheme)
    @AllowNull(true)
    @Column({
        type: DataType.INTEGER,
        field: 'theme_id',
        references: {
            model: 'site_theme',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    declare themeId: number | null;

    @BelongsTo(() => SiteTheme)
    declare theme?: SiteTheme;
}
