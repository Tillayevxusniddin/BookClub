// models/club.js

const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Club = sequelize.define('Club', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        adminId: {
            type: DataTypes.UUID,
            allowNull: true, // `onDelete: 'SET NULL'` bo'lgani uchun
            references: {
                model: 'Users',
                key: 'id'
            }
        },
    }, {
        timestamps: true,
    });
    return Club;
};