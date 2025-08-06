const { User, Profile } = require('../models');

exports.showProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUser = req.user;

        if (currentUser.id !== userId && currentUser.role !== 'admin') {
            req.flash('error', "You are not authorized to view this profile.");
            return res.redirect('/clubs');
        }

        const user = await User.findByPk(userId, {
            include: [{ model: Profile, attributes: ['firstName', 'lastName', 'bio'] }],
            attributes: ['id', 'username', 'email', 'role']
        });

        if (!user) {
            req.flash('error', "User not found.");
            return res.redirect('/clubs');
        }

        res.render('profile/show', {
            title: `${user.username}'s profile`,
            user: user,
            currentUser: currentUser,
            errors: req.flash('error'),
            success: req.flash('success')
        });

    } catch (error) {
        console.error("An error occurred while displaying the profile:", error);
        req.flash('error', "An unexpected error occurred while loading the profile.");
        res.redirect('/clubs');
    }
};

exports.showEditProfileForm = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUser = req.user;

        if (currentUser.id !== userId) {
            req.flash('error', "You are not allowed to edit this profile.");
            return res.redirect(`/profile/${userId}`);
        }

        const user = await User.findByPk(userId, {
            include: [{ model: Profile, attributes: ['firstName', 'lastName', 'bio'] }],
            attributes: ['id', 'username', 'email']
        });

        if (!user) {
            req.flash('error', "User not found.");
            return res.redirect('/clubs');
        }

        res.render('profile/edit', {
            title: "Edit Profile",
            user: user,
            csrfToken: req.csrfToken(),
            errors: req.flash('error'),
            success: req.flash('success')
        });

    } catch (error) {
        console.error("An error occurred while displaying the profile edit form:", error);
        req.flash('error', "An unexpected error occurred while loading the profile edit form.");
        res.redirect('/clubs');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { firstName, lastName, bio } = req.body;
        const currentUser = req.user;

        if (currentUser.id !== userId) {
            req.flash('error', "You are not allowed to update this profile.");
            return res.redirect(`/profile/${userId}`);
        }

        const profile = await Profile.findOne({ where: { userId } });

        if (!profile) {
            req.flash('error', "Profile not found.");
            return res.redirect(`/profile/${userId}`);
        }

        profile.firstName = firstName || profile.firstName;
        profile.lastName = lastName || profile.lastName;
        profile.bio = bio || profile.bio;
        await profile.save();

        req.flash('success', "Profile updated successfully.");
        res.redirect(`/profile/${userId}`);

    } catch (error) {
        console.error("An error occurred while updating your profile:", error);
        req.flash('error', "An unexpected error occurred while updating your profile.");
        res.redirect(`/profile/${req.params.id}/edit`);
    }
};
