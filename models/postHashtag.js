// models/postHashtag.js
module.exports = (sequelize, DataTypes) => {
    const PostHashtag = sequelize.define('PostHashtag', {
        // Bu modelda qo'shimcha maydonlar kerak emas, faqat foreign keylar
    }, {
        tableName: 'PostHashtags',
        timestamps: false,
    });
    return PostHashtag;
};