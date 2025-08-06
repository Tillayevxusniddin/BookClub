const { Review, User, Book } = require('../models');

exports.showAddReviewForm = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findByPk(bookId);

        if (!book) {
            req.flash('error', "No book found to write a review."); // Corrected message
            return res.redirect('/books');
        }

        const existingReview = await Review.findOne({ where: { bookId, userId: req.user.id } });
        if (existingReview) {
            req.flash('error', "You have already written a review for this book. You can edit it."); // Corrected message
            return res.redirect(`/books/${bookId}`);
        }

        res.render('review/form', {
            title: `Write a review for ${book.title}`, // Corrected title
            book: book,
            review: {},
            csrfToken: req.csrfToken(),
            errors: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("An error occurred while displaying the review form:", error); // Corrected message
        req.flash('error', "An unexpected error occurred while loading the review form."); // Corrected message
        res.redirect('/books');
    }
};

exports.addReview = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const book = await Book.findByPk(bookId);
        if (!book) {
            req.flash('error', "No book found to review."); // Corrected message
            return res.redirect(`/books`);
        }

        const existingReview = await Review.findOne({ where: { bookId, userId } });
        if (existingReview) {
            req.flash('error', "You have already written a review of this book."); // Corrected message
            return res.redirect(`/books/${bookId}`);
        }

        if (rating < 1 || rating > 5) {
            req.flash('error', "The rating must be between 1 and 5.");
            return res.redirect(`/books/${bookId}/add`); // Corrected route path
        }

        await Review.create({ bookId, userId, rating, comment });
        req.flash('success', "Review added successfully.");
        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error("An error occurred while adding a review:", error); // Corrected message
        req.flash('error', "An unexpected error occurred while adding a review."); // Corrected message
        res.redirect(`/books/${req.params.bookId}/add`); // Corrected route path
    }
};

exports.showEditReviewForm = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id, {
            include: [{ model: Book, attributes: ['id', 'title'] }]
        });

        if (!review) {
            req.flash('error', "Review not found."); // Corrected message
            return res.redirect('/books');
        }
        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to edit this review."); // Corrected message
            return res.redirect(`/books/${review.bookId}`);
        }

        res.render('review/form', {
            title: `Edit review for ${review.Book.title}`, // Corrected title
            book: review.Book,
            review: review,
            csrfToken: req.csrfToken(),
            errors: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("An error occurred while displaying the review edit form:", error); // Corrected message
        req.flash('error', "An unexpected error occurred while loading the review edit form."); // Corrected message
        res.redirect('/books');
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const review = await Review.findByPk(id);

        if (!review) {
            req.flash('error', "Review not found.");
            return res.redirect('/books');
        }
        if (review.userId !== userId && req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to update this review.");
            return res.redirect(`/books/${review.bookId}`);
        }

        if (rating < 1 || rating > 5) {
            req.flash('error', "The rating must be between 1 and 5.");
            return res.redirect(`/reviews/${id}/edit`);
        }

        review.rating = rating !== undefined ? rating : review.rating;
        review.comment = comment || review.comment;
        await review.save();

        req.flash('success', "The review was successfully updated.");
        res.redirect(`/books/${review.bookId}`);
    } catch (error) {
        console.error("An error occurred while updating the review:", error); // Corrected message
        req.flash('error', "An unexpected error occurred while updating the review."); // Corrected message
        res.redirect(`/reviews/${req.params.id}/edit`);
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const review = await Review.findByPk(id);

        if (!review) {
            req.flash('error', "Review not found."); // Corrected message
            return res.redirect('/books');
        }
        if (review.userId !== userId && req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to delete this review."); // Corrected message
            return res.redirect(`/books/${review.bookId}`);
        }

        const bookId = review.bookId;
        await review.destroy();
        req.flash('success', "Review successfully deleted."); // Corrected message
        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error("An error occurred while deleting the review:", error); // Corrected message
        req.flash('error', "An unexpected error occurred while deleting the review."); // Corrected message
        res.redirect(`/books/${req.params.id}`); // This might need to be /reviews/:id/delete if it's the specific review page
    }
};