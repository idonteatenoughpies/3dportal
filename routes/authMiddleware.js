module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login')
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {res.redirect('/dashboard')
    }
}

// isAuth and isAdmin code courtesy of Zach Golwitzer   https://www.youtube.com/watch?v=J1qXK66k1y4