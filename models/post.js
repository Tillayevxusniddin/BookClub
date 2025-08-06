const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: { 
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            }
        },
    }, {
        timestamps: true,
    });
    return Post;
};