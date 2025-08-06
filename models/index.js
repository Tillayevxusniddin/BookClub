const sequelize = require('../config/database'); 
const { DataTypes } = require('sequelize'); 
const { v4: uuidv4 } = require('uuid');


const User = require('./user')(sequelize, DataTypes);
const Profile = require('./profile')(sequelize, DataTypes);
const Club = require('./club')(sequelize, DataTypes);
const Book = require('./book')(sequelize, DataTypes);
const Review = require('./review')(sequelize, DataTypes);
const Comment = require('./comment')(sequelize, DataTypes); 
const Token = require('./token')(sequelize, DataTypes);


const Post = require('./post')(sequelize, DataTypes);
const Image = require('./image')(sequelize, DataTypes);
const Hashtag = require('./hashtag')(sequelize, DataTypes);
const PostHashtag = require('./postHashtag')(sequelize, DataTypes);
const BlogComment = require('./blogComment')(sequelize, DataTypes);

User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Club, { foreignKey: 'adminId', as: 'Clubs', onDelete: 'SET NULL' });
Club.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

Club.hasMany(Book, { foreignKey: 'clubId', onDelete: 'CASCADE' });
Book.belongsTo(Club, { foreignKey: 'clubId' });

User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Review, { foreignKey: 'bookId', onDelete: 'CASCADE' });
Review.belongsTo(Book, { foreignKey: 'bookId' });

User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Review.hasMany(Comment, { foreignKey: 'reviewId', onDelete: 'CASCADE' });
Comment.belongsTo(Review, { foreignKey: 'reviewId' });

User.hasMany(Token, { foreignKey: 'userId', onDelete: 'CASCADE' });
Token.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Image, { foreignKey: 'postId', onDelete: 'CASCADE' });
Image.belongsTo(Post, { foreignKey: 'postId' });

Post.belongsToMany(Hashtag, { through: PostHashtag, foreignKey: 'postId' });
Hashtag.belongsToMany(Post, { through: PostHashtag, foreignKey: 'hashtagId' });

Post.hasMany(BlogComment, { foreignKey: 'postId', onDelete: 'CASCADE' });
BlogComment.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(BlogComment, { foreignKey: 'userId', onDelete: 'CASCADE' });
BlogComment.belongsTo(User, { foreignKey: 'userId' });

BlogComment.hasMany(BlogComment, { as: 'Replies', foreignKey: 'parentId', onDelete: 'CASCADE' });
BlogComment.belongsTo(BlogComment, { as: 'Parent', foreignKey: 'parentId' });


const db = {
    sequelize,
    User,
    Profile,
    Club,
    Book,
    Review,
    Comment, 
    Token,
    Post,
    Image,
    Hashtag,
    PostHashtag,
    BlogComment
};

module.exports = db;