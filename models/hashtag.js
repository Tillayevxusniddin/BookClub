const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        timestamps: false,
    });
    return Hashtag;
};