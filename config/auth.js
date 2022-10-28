const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')

// Models

require('../models/User')
const User = mongoose.model('user')

module.exports = function(passport) {

    passport.use(new localStrategy({usernameField: 'email', passwordField:'password'}, (email, password, done) => {

        User.findOne({email: email}).then((user) => {
            

            if(!user) {

                return done (null, false, console.log('Essa conta nao existe'))

            }else {
                
                return done (null, user)
               

            }
            
        })

    }
))

    passport.serializeUser((user, done) => {

        done(null, user.id)

    })

    passport.deserializeUser((id, done) => {

        User.findById(id, (err, user) => {

            done(err, user)

        })

    })

}