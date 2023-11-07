const User = require('../models/user');
const passport = require('passport');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETE_KEY;

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    //console.log("=========email===========", jwt_payload.email);
    try {
        const user = await User.findById(jwt_payload._id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    } catch (error) {
        console.log("error in finding User");
        return;
    }

}))
module.exports.passport;