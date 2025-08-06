const { BlogComment } = require('../models');

exports.createComment = async (req, res) => {
    try {
        const { content, parentId } = req.body;
        const { postId } = req.params;

        if (!content || content.trim() === '') {
            req.flash('error', 'Comment cannot be empty.');
            return res.redirect(`/posts/${postId}`);
        }

        await BlogComment.create({
            content,
            postId,
            userId: req.user.id,
            parentId: parentId || null,
        });

        req.flash('success', "Comment added.");
        res.redirect(`/posts/${postId}`);
    } catch (error) {
        console.error("Error adding comment:", error);
        req.flash('error', 'There was an error adding the comment.');
        res.redirect(`/posts/${req.params.postId}`);
    }
};