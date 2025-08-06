const { Comment, User, Review, Book } = require('../models');

exports.showAddCommentForm = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findByPk(reviewId, {
            include: [{ model: User, attributes: ['username'] }, { model: Book, attributes: ['id', 'title'] }] // Include Book to get book title for redirection
        });

        if (!review) {
            req.flash('error', "Review not found to write a comment.");
            return res.redirect('/books');
        }

        res.render('comment/form', {
            title: `Write a comment on the review`,
            review: review,
            comment: {},
            csrfToken: req.csrfToken(),
            errors: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("An error occurred while displaying the comment form:", error); // Corrected message
        req.flash('error', "An unexpected error occurred while loading the comment form."); // Corrected message
        res.redirect('/books');
    }
};

exports.addComment = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const review = await Review.findByPk(reviewId);
        if (!review) {
            req.flash('error', "Review not found to write a comment."); 
            return res.redirect(`/books`);
        }

        const newComment = await Comment.create({ reviewId, userId, content });
        req.flash('success', "Comment added successfully.");
        res.redirect(`/books/${review.bookId}`); 
    } catch (error) {
        console.error("An error occurred while adding a comment:", error);
        req.flash('error', "An unexpected error occurred while adding a comment."); 
        res.redirect(`/reviews/${req.params.reviewId}/add`); 
    }
};

exports.showEditCommentForm = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByPk(id, {
            include: [{ model: Review, attributes: ['id', 'bookId', 'comment'] }]
        });

        if (!comment) {
            req.flash('error', "Comment not found."); 
            return res.redirect('/books');
        }
        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to edit this comment.");
            return res.redirect(`/books/${comment.Review.bookId}`);
        }

        res.render('comment/form', {
            title: `Edit comment`,
            review: comment.Review,
            comment: comment,
            csrfToken: req.csrfToken(),
            errors: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("An error occurred while displaying the comment edit form:", error); // Corrected message
        req.flash('error', "An unexpected error occurred while loading the comment edit form."); // Corrected message
        res.redirect('/books');
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const comment = await Comment.findByPk(id, {
            include: [{ model: Review }]
        });

        if (!comment) {
            req.flash('error', "Comment not found.");
            return res.redirect('/books');
        }
        if (comment.userId !== userId && req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to update this comment.");
            return res.redirect(`/books/${comment.Review.bookId}`);
        }

        comment.content = content || comment.content;
        await comment.save();

        req.flash('success', "The comment was successfully updated."); 
        res.redirect(`/books/${comment.Review.bookId}`);
    } catch (error) {
        console.error("An error occurred while updating the comment:", error);
        req.flash('error', "An unexpected error occurred while updating the comment."); 
        res.redirect(`/comments/${req.params.id}/edit`);
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findByPk(id, {
            include: [{ model: Review }]
        });

        if (!comment) {
            req.flash('error', "Comment not found."); 
            return res.redirect('/books');
        }
        if (comment.userId !== userId && req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to delete this comment."); 
            return res.redirect(`/books/${comment.Review.bookId}`);
        }

        const bookId = comment.Review.bookId;
        await comment.destroy();
        req.flash('success', "The comment was successfully deleted."); 
        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error("An error occurred while deleting the comment:", error); 
        req.flash('error', "An unexpected error occurred while deleting the comment.");
        res.redirect(`/books/${req.params.id}`);
    }
};