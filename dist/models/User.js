"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../instances/pg");
exports.User = pg_1.sequelize.define('User', {
    id: {
        primaryKey: true,
        type: sequelize_1.DataTypes.STRING
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    tableName: 'users',
    timestamps: false
});
