// models/index.js

const sequelize = require('../config/database'); // Sequelize instance'i
const { DataTypes } = require('sequelize'); // Ma'lumot turlari
const { v4: uuidv4 } = require('uuid'); // UUID yaratish uchun

// Barcha model fayllarini yuklash
const User = require('./user')(sequelize, DataTypes);
const Profile = require('./profile')(sequelize, DataTypes);
const Club = require('./club')(sequelize, DataTypes);
const Book = require('./book')(sequelize, DataTypes);
const Review = require('./review')(sequelize, DataTypes);
const Comment = require('./comment')(sequelize, DataTypes); // YECHIM: Comment modelini ham yuklaymiz
const Token = require('./token')(sequelize, DataTypes);



const Post = require('./post')(sequelize, DataTypes);
const Image = require('./image')(sequelize, DataTypes);
const Hashtag = require('./hashtag')(sequelize, DataTypes);
const PostHashtag = require('./postHashtag')(sequelize, DataTypes);
const BlogComment = require('./blogComment')(sequelize, DataTypes);

// Modellar orasidagi aloqalarni aniqlash (Assotsiatsiyalar)

// User va Profile: One-to-One
User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId' });

// User va Club: One-to-Many (User - admin sifatida bir nechta Club ga ega bo'lishi mumkin)
// 'as: Clubs' bu yerda User.getClubs() yoki User.addClub() kabi metodlarda ishlatiladi.
User.hasMany(Club, { foreignKey: 'adminId', as: 'Clubs', onDelete: 'SET NULL' });
// 'as: admin' bu yerda Club.getAdmin() yoki Club.setAdmin() kabi metodlarda va eager loadingda ishlatiladi.
Club.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

// Club va Book: One-to-Many
Club.hasMany(Book, { foreignKey: 'clubId', onDelete: 'CASCADE' });
Book.belongsTo(Club, { foreignKey: 'clubId' });

// User va Review: One-to-Many
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Book va Review: One-to-Many
Book.hasMany(Review, { foreignKey: 'bookId', onDelete: 'CASCADE' });
Review.belongsTo(Book, { foreignKey: 'bookId' });

// User va Comment: One-to-Many
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// Review va Comment: One-to-Many
Review.hasMany(Comment, { foreignKey: 'reviewId', onDelete: 'CASCADE' });
Comment.belongsTo(Review, { foreignKey: 'reviewId' });

// User va Token: One-to-Many
User.hasMany(Token, { foreignKey: 'userId', onDelete: 'CASCADE' });
Token.belongsTo(User, { foreignKey: 'userId' });



// --- BLOG TIZIMI UCHUN YANGI ASSOTSIATSIYALAR ---

// User va Post: One-to-Many
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

// Post va Image: One-to-Many
Post.hasMany(Image, { foreignKey: 'postId', onDelete: 'CASCADE' });
Image.belongsTo(Post, { foreignKey: 'postId' });

// Post va Hashtag: Many-to-Many
Post.belongsToMany(Hashtag, { through: PostHashtag, foreignKey: 'postId' });
Hashtag.belongsToMany(Post, { through: PostHashtag, foreignKey: 'hashtagId' });

// Blog Post va Blog Comment: One-to-Many
Post.hasMany(BlogComment, { foreignKey: 'postId', onDelete: 'CASCADE' });
BlogComment.belongsTo(Post, { foreignKey: 'postId' });

// User va Blog Comment: One-to-Many
User.hasMany(BlogComment, { foreignKey: 'userId', onDelete: 'CASCADE' });
BlogComment.belongsTo(User, { foreignKey: 'userId' });

// Blog Commentning o'z-o'ziga bog'liqligi (javoblar uchun)
BlogComment.hasMany(BlogComment, { as: 'Replies', foreignKey: 'parentId', onDelete: 'CASCADE' });
BlogComment.belongsTo(BlogComment, { as: 'Parent', foreignKey: 'parentId' });



// Barcha modellarni va Sequelize instance'ni eksport qilish
const db = {
    sequelize,
    User,
    Profile,
    Club,
    Book,
    Review,
    Comment, // YECHIM: Comment modelini ham db ob'ektiga qo'shamiz
    Token,
    Post,
    Image,
    Hashtag,
    PostHashtag,
    BlogComment
};

module.exports = db;