module.exports = (sequelize, DataTypes) => {
    const PostHashtag = sequelize.define('PostHashtag', {
    }, {
        tableName: 'PostHashtags',
        timestamps: false,
    });
    return PostHashtag;
};