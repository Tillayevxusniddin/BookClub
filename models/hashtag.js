// models/hashtag.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        tag: { // Masalan: 'dasturlash', 'kitob'
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Xeshteglar takrorlanmasligi uchun
        },
    }, {
        timestamps: false, // Odatda xeshteglar uchun timestamp kerak emas
    });
    return Hashtag;
};