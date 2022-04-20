import { DataTypes, Model } from "sequelize";
import { sequelize } from '../instances/pg';

export interface UserInstance extends Model {
    id: string;
    name: string;
    email: string;
    password: string
}

export const User = sequelize.define<UserInstance>('User', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'users',
    timestamps: false
})