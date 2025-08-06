const { Club, User, Book } = require('../models');

exports.getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.findAll({
            include: [{ model: User, as: 'admin', attributes: ['username'] }]
        });

        res.render('club/list', {
            title: "Book Clubs",
            clubs: clubs,
            csrfToken: req.csrfToken(),
            currentUser: req.user,
            errors: req.flash('error'),
            success: req.flash('success')
        });

    } catch (error) {
        console.error("An error occurred while retrieving clubs:", error);
        req.flash('error', "An unexpected error occurred while loading clubs.");
        res.redirect('/');
    }
}

exports.getClubById = async (req, res) => {
    try {
        const { id } = req.params;
        const club = await Club.findByPk(id, {
            include: [
                { model: User, as: 'admin', attributes: ['username'] },
                { model: Book, attributes: ['id', 'title', 'author', 'description'] }
            ]
        });

        if (!club) {
            req.flash('error', "Club not found.");
            return res.redirect('/clubs');
        }

        res.render('club/detail', {
            title: `${club.name} Club`,
            club: club,
            csrfToken: req.csrfToken(),
            currentUser: req.user,
            errors: req.flash('error'),
            success: req.flash('success')
        });

    } catch (error) {
        console.error("An error occurred while retrieving club:", error);
        req.flash('error', "An unexpected error occurred while loading club information.");
        res.redirect('/clubs');
    }
}

exports.showCreateClubForm = (req, res) => {
    if (req.user.role !== 'admin') {
        req.flash('error', "You do not have permission to create a club.");
        return res.redirect('/clubs');
    }
    res.render('club/form', {
        title: "Create New Club",
        club: {},
        csrfToken: req.csrfToken(),
        errors: req.flash('error'),
        success: req.flash('success')
    });
};

exports.createClub = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            req.flash('error', "You do not have permission to create a club.");
            return res.redirect('/clubs');
        }

        const { name, description } = req.body;
        const newClub = await Club.create({ name, description, adminId: req.user.id });

        req.flash('success', `Club ${newClub.name} was successfully created.`);
        res.redirect(`/clubs/${newClub.id}`);

    } catch (error) {
        console.error("An error occurred while creating a club:", error);
        req.flash('error', "An unexpected error occurred while creating the club.");
        res.redirect('/clubs/create');
    }
};

exports.showEditClubForm = async (req, res) => {
    try {
        const { id } = req.params;
        const club = await Club.findByPk(id);

        if (!club) {
            req.flash('error', "Club not found.");
            return res.redirect('/clubs');
        }
        if (req.user.role !== 'admin' && req.user.id !== club.adminId) {
            req.flash('error', "You do not have permission to edit this club.");
            return res.redirect(`/clubs/${id}`);
        }
        res.render('club/form', {
            title: `Edit ${club.name} Club`,
            club: club,
            csrfToken: req.csrfToken(),
            errors: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("An error occurred while displaying the club edit form:", error);
        req.flash('error', "An unexpected error occurred while loading the club edit form.");
        res.redirect('/clubs');
    }
};

exports.updateClub = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const club = await Club.findByPk(id);

        if (!club) {
            req.flash('error', "Club not found.");
            return res.redirect('/clubs');
        }
        if (req.user.role !== 'admin' && req.user.id !== club.adminId) {
            req.flash('error', "You do not have permission to update this club.");
            return res.redirect(`/clubs/${id}`);
        }

        club.name = name || club.name;
        club.description = description || club.description;
        await club.save();

        req.flash('success', "The club has been successfully updated.");
        res.redirect(`/clubs/${id}`);
    } catch (error) {
        console.error("An error occurred while updating the club:", error);
        req.flash('error', "An unexpected error occurred while updating the club.");
        res.redirect(`/clubs/${req.params.id}/edit`);
    }
};

exports.deleteClub = async (req, res) => {
    try {
        const { id } = req.params;
        const club = await Club.findByPk(id);

        if (!club) {
            req.flash('error', "Club not found.");
            return res.redirect('/clubs');
        }
        if (req.user.role !== 'admin' && req.user.id !== club.adminId) {
            req.flash('error', "You do not have permission to delete this club.");
            return res.redirect(`/clubs/${id}`);
        }

        await club.destroy();
        req.flash('success', "Club successfully deleted.");
        res.redirect('/clubs');
    } catch (error) {
        console.error("An error occurred while deleting the club:", error);
        req.flash('error', "An unexpected error occurred while deleting the club.");
        res.redirect(`/clubs/${req.params.id}`);
    }
};