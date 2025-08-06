// models/token.js

const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            }
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        expiry: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });
    return Token;
};