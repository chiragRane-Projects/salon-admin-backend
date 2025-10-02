const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const customers = require('../models/customers');

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/customers/auth/google/callback"
    }, 
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await customers.findOne({email: profile.emails[0].value});

            if(!user){
                user = await customers.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: null
                });
            }
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
)
)


module.exports = passport;