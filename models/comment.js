// models/comment.js

const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        reviewId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Reviews',
                key: 'id',
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });
    return Comment;
};