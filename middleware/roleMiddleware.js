const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next(); // If the user is an admin, continue
    }
    
    // SOLUTION: Instead of redirecting to 'back', redirect to a safe, known URL like the main clubs page.
    req.flash('error', "You do not have permission to access that page.");
    res.status(403).redirect('/clubs'); 
};

module.exports = { isAdmin };