const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

// parseForm'ni bu yerdan olib tashladik, chunki u app.js da global ishlatilmoqda
module.exports = { csrfProtection };