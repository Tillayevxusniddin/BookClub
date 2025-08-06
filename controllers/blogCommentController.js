const { BlogComment } = require('../models');

exports.createComment = async (req, res) => {
    try {
        const { content, parentId } = req.body;
        const { postId } = req.params;

        if (!content || content.trim() === '') {
            req.flash('error', 'Kommentariya boʻsh boʻlishi mumkin emas.');
            return res.redirect(`/posts/${postId}`);
        }

        await BlogComment.create({
            content,
            postId,
            userId: req.user.id,
            parentId: parentId || null,
        });

        req.flash('success', "Kommentariya qo'shildi.");
        res.redirect(`/posts/${postId}`);
    } catch (error) {
        console.error("Kommentariya qo'shishda xatolik:", error);
        req.flash('error', 'Kommentariya qo\'shishda xatolik yuz berdi.');
        res.redirect(`/posts/${req.params.postId}`);
    }
};