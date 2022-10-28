const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { route } = require('moongose/routes')
require('../models/User')
const User = mongoose.model('user')
const passport = require('passport')

router.get('/registration', (req, res) => {
    
    res.render('user/registration')
})

router.post('/registration', (req, res) => {

    var err = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        err.push({text: 'Nome inválido'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
       err.push({text: 'E-mail inválido'}) 
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        err.push({text: 'Senha inválida' })
    }
    if (req.body.password.length < 7) {
        err.push({text: 'Senha muito curta'})
    }
    if (req.body.password !== req.body.password2) {
        err.push({text: 'Senhas diferentes'})
    }
    if(err.length > 0){
        res.render('user/registration', {err:err})
    }
    else{

        User.findOne({email: req.body.email}).then((user) => {

            if(user) {

                var err = []

                err.push({text: 'E-mail já cadastrado'})
                res.render('user/registration', {err:err})

            }

            else {

                User.findOne({name: req.body.name}).then((user) => {

                    if(user) {
                        var err = []

                        err.push({text: 'Nome já cadastrado'})
                        res.render('user/registration', {err:err})
                    }else {

                        const NewUser = new User ({
        
                            name: req.body.name,
                            email: req.body.email,
                            password: req.body.password
                        })
                        NewUser.save().then(() => {
                            console.log('Usuário criado com sucesso')
                            req.flash('success_msg','Usuário criado com sucesso')
                            res.redirect('/')
                        })

                    }

                })
        
        
}})

    }

})

router.get('/login', (req, res) => {

    res.render('user/login')

})

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {

        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true

    })(req, res, next)

})

router.get('/logout', (req, res, next) => {

    req.logout((err) => {
        req.flash('success_msg','Deslogado')
        res.redirect('/')
    })


})


router.get('/account', (req, res)=> {

    res.render('user/account')

})

module.exports = router