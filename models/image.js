// models/image.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        url: { // Rasmning serverdagi manzili
            type: DataTypes.STRING,
            allowNull: false,
        },
        postId: { // Qaysi postga tegishli ekanligi
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Posts',
                key: 'id',
            }
        },
    }, {
        timestamps: true,
    });
    return Image;
};