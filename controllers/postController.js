const { Post, Image, Hashtag, BlogComment, User, sequelize } = require('../models');

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
        console.error("Error retrieving all posts:", error);
        req.flash('error', "There was an error loading posts.");
        res.redirect('/');
    }
};

exports.showCreateForm = (req, res) => {
    try {
        res.render('post/create', { 
            title: 'Create New Post',
            csrfToken: req.csrfToken() 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while loading the page.");
    }
};

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
        req.flash('success', 'Post was successfully created!');
        res.redirect(`/posts/${post.id}`);
    } catch (error) {
        await t.rollback();
        console.error("Error while creating post:", error);
        req.flash('error', "An error occurred while creating the post. Please try again.");
        res.status(422).render('post/create', {
            title: "Create New Post",
            post: { title, content }
        });
    }
};

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
            req.flash('error', "Post not found.");
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
        console.error("Error while retrieving post:", error);
        req.flash('error', "An error occurred while loading the post.");
        res.redirect('/');
    }
};
