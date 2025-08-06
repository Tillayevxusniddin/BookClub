// controllers/postController.js
const { Post, Image, Hashtag, BlogComment, User, sequelize } = require('../models');

// Kommentlarni daraxtsimon qilish uchun yordamchi funksiya
const buildCommentTree = (comments) => {
    const commentMap = new Map(comments.map(comment => [comment.id, comment]));
    commentMap.forEach(comment => {
        comment.Replies = [];
    });
    const tree = [];
    commentMap.forEach(comment => {
        if (comment.parentId && commentMap.has(comment.parentId)) {
            commentMap.get(comment.parentId).Replies.push(comment);
        } else {
            tree.push(comment);
        }
    });
    return tree;
};

// Barcha postlar ro'yxatini ko'rsatish
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Image, attributes: ['url'], limit: 1 }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.render('post/list', { title: "Blog", posts: posts, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error("Barcha postlarni olishda xatolik:", error);
        req.flash('error', "Postlarni yuklashda xatolik yuz berdi.");
        res.redirect('/');
    }
};

// Post yaratish formasini ko'rsatish
exports.showCreateForm = (req, res) => {
    try {
        res.render('post/create', { 
        title: 'Yangi Post Yaratish',
        csrfToken: req.csrfToken() 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Sahifani yuklashda xatolik yuz berdi.");
    }
};

// Yangi post yaratish
exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const t = await sequelize.transaction();
    try {
        const post = await Post.create({ title, content, userId: req.user.id }, { transaction: t });

        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => ({ url: '/uploads/' + file.filename, postId: post.id }));
            await Image.bulkCreate(images, { transaction: t });
        }

        const tags = content.match(/#\w+/g) || [];
        if (tags.length > 0) {
            const uniqueTags = [...new Set(tags.map(tag => tag.substring(1).toLowerCase()))];
            const hashtagPromises = uniqueTags.map(tag => Hashtag.findOrCreate({ where: { tag }, transaction: t }));
            const createdTags = await Promise.all(hashtagPromises);
            await post.addHashtags(createdTags.map(t => t[0]), { transaction: t });
        }

        await t.commit();
        req.flash('success', 'Post muvaffaqiyatli yaratildi!');
        res.redirect(`/posts/${post.id}`);
    } catch (error) {
        await t.rollback();
        console.error("Post yaratishda xatolik:", error);
        req.flash('error', "Post yaratishda xatolik yuz berdi. Iltimos, qayta urining.");
        res.status(422).render('post/create', {
            title: "Yangi post yaratish",
            post: { title, content }
        });
    }
};

// Bitta postni ko'rsatish
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Image, attributes: ['url'] },
                { model: Hashtag, attributes: ['tag'], through: { attributes: [] } },
                { model: BlogComment, include: [{ model: User, attributes: ['id', 'username'] }] }
            ],
            order: [[BlogComment, 'createdAt', 'ASC']]
        });
        if (!post) {
            req.flash('error', "Post topilmadi.");
            return res.redirect('/');
        }
        const commentsInTree = buildCommentTree(post.BlogComments);
        res.render('post/detail', {
            title: post.title,
            csrfToken: req.csrfToken(),
            post,
            comments: commentsInTree
        });
    } catch (error) {
        console.error("Postni olishda xatolik:", error);
        req.flash('error', "Postni yuklashda xatolik yuz berdi.");
        res.redirect('/');
    }
};