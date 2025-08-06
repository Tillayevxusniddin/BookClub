const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const BlogComment = sequelize.define('BlogComment', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
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
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Posts',
                key: 'id',
            }
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'BlogComments',
                key: 'id'
            }
        },
    }, {
        timestamps: true,
        tableName: 'BlogComments'
    });
    return BlogComment;
};
