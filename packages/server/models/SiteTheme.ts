import { Optional } from 'sequelize';
import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';

export interface SiteThemeAttributes {
    id: number;
    theme: string;
    description: string;
}

export type SiteThemeCreationAttributes = Optional<SiteThemeAttributes, 'id'>;

@Table({
    timestamps: false,
    paranoid: true,
    tableName: 'site_theme',
})
export class SiteTheme extends Model<
    SiteThemeAttributes,
    SiteThemeCreationAttributes
> {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    declare theme: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare description: string;
}
