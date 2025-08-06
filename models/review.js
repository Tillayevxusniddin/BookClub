// models/review.js

const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Books',
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
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });
    return Review;
};