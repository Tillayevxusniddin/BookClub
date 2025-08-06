// models/blogComment.js
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
        userId: { // Komment muallifi
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            }
        },
        postId: { // Qaysi postga tegishli ekanligi
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Posts',
                key: 'id',
            }
        },
        parentId: { // Javob berilayotgan kommentning IDsi (threaded comments uchun)
            type: DataTypes.UUID,
            allowNull: true, // Agar null bo'lsa, bu asosiy kommentariya
            references: {
                model: 'BlogComments', // O'z-o'ziga ishora qiladi
                key: 'id'
            }
        },
    }, {
        timestamps: true,
        tableName: 'BlogComments' // Jadval nomini aniq belgilash
    });
    return BlogComment;
};