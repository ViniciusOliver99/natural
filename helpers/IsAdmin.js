module.exports = {

    IsAdmin: function(req, res, next) {

        if(req.isAuthenticated() && req.user.name == 'Admin') {

            return next();
        }

        req.flash('success_msg', 'Voçê deve logar como Admin para entrar ai, login: admin123@gmail.com, senha:12345678')
        res.redirect('/')
    }

}