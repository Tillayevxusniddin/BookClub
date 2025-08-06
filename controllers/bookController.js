// controllers/bookController.js

const { Book, Club, Review, User, Comment } = require('../models');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            include: [{ model: Club, attributes: ['name'] }]
        });
        res.render('book/list', {
            title: "All Books",
            books: books,
            csrfToken: req.csrfToken(),
            currentUser: req.user,
            errors: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("An error occurred while retrieving books:", error);
        req.flash('error', "An unexpected error occurred while loading books.");
        res.redirect('/clubs');
    }
};

exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id, {
            include: [
                { model: Club, attributes: ['id', 'name'] },
                {
                    model: Review,
                    order: [['createdAt', 'DESC']], // Sharhlarni yangisidan eskisiga qarab saralash
                    include: [
                        { model: User, attributes: ['username'] }, // Sharh avtori
                        {
                            model: Comment, // <<< YECHIM: HAR BIR SHARH UCHUN KOMMENTARIYALARNI HAM OLISH
                            order: [['createdAt', 'ASC']], // Kommentariyalarni eskidan yangisiga qarab saralash
                            include: [{ model: User, attributes: ['username'] }] // Kommentariya avtori
                        }
                    ]
                }
            ]
        });

        if (!book) {
            req.flash('error', "Book not found.");
            return res.redirect('/books');
        }
        res.render('book/detail', {
            title: `${book.title}`,
            book: book,
            csrfToken: req.csrfToken(),
            currentUser: req.user,
            csrfToken: req.csrfToken(), // <<< CSRF tokenini ham yuborishni tavsiya qilaman
            errors: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("An error occurred while retrieving the book:", error);
        req.flash('error', "An unexpected error occurred while loading book data.");
        res.redirect('/books');
    }
};

exports.showCreateBookForm = async (req, res) => {
    if (req.user.role !== 'admin') {
        req.flash('error', "You do not have permission to add books.");
        return res.redirect('/books');
    }
    try {
        const clubs = await Club.findAll({ attributes: ['id', 'name'] });
        res.render('book/form', {
            title: "Add a new book", // Corrected title
            book: {},
            clubs: clubs,
            csrfToken: req.csrfToken(),
            errors: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("An error occurred while displaying the book creation form:", error);
        req.flash('error', "An unexpected error occurred while loading the form.");
        res.redirect('/books');
    }
};

exports.createBook = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to add books.");
            return res.redirect('/books');
        }
        const { title, author, description, clubId } = req.body;

        const club = await Club.findByPk(clubId);
        if (!club) {
            req.flash('error', "The specified club was not found.");
            return res.redirect('/books/create');
        }

        const newBook = await Book.create({ title, author, description, clubId });
        req.flash('success', `${newBook.title} was successfully added.`);
        res.redirect(`/books/${newBook.id}`);
    } catch (error) {
        console.error("An error occurred while adding the book:", error);
        req.flash('error', "An unexpected error occurred while adding a book.");
        res.redirect('/books/create');
    }
};

exports.showEditBookForm = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);

        if (!book) {
            req.flash('error', "Book not found.");
            return res.redirect('/books');
        }
        if (req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to edit this book.");
            return res.redirect(`/books/${id}`);
        }
        const clubs = await Club.findAll({ attributes: ['id', 'name'] });
        res.render('book/form', {
            title: `Edit ${book.title}`, // Corrected title
            book: book,
            clubs: clubs,
            csrfToken: req.csrfToken(),
            errors: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("An error occurred while displaying the book edit form:", error);
        req.flash('error', "An unexpected error occurred while loading the book edit form.");
        res.redirect('/books');
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, description, clubId } = req.body;
        const book = await Book.findByPk(id);

        if (!book) {
            req.flash('error', "Book not found.");
            return res.redirect('/books');
        }
        if (req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to update this book.");
            return res.redirect(`/books/${id}`);
        }

        if (clubId && clubId !== book.clubId) {
            const newClub = await Club.findByPk(clubId);
            if (!newClub) {
                req.flash('error', "The specified club for update was not found.");
                return res.redirect(`/books/${id}/edit`);
            }
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.description = description || book.description;
        book.clubId = clubId || book.clubId;
        await book.save();

        req.flash('success', "The book was successfully updated."); // Corrected message
        res.redirect(`/books/${id}`);
    } catch (error) {
        console.error("An error occurred while updating the book:", error);
        req.flash('error', "An unexpected error occurred while updating the book.");
        res.redirect(`/books/${req.params.id}/edit`);
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);

        if (!book) {
            req.flash('error', "Book not found.");
            return res.redirect('/books');
        }
        if (req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to delete this book.");
            return res.redirect(`/books/${id}`);
        }

        await book.destroy();
        req.flash('success', "Book successfully deleted.");
        res.redirect('/books');
    } catch (error) {
        console.error("An error occurred while deleting the book:", error);
        req.flash('error', "An unexpected error occurred while deleting the book.");
        res.redirect(`/books/${req.params.id}`);
    }
};