var LocalStrategy = require("passport-local").Strategy,
    bcrypt        = require("bcrypt"),
    db            = require("./database.js");

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        db.GetUserByID(id, function (err, results) {
            done(err, results[0]);
        });
    });

    passport.use(
        "local-login",
        new LocalStrategy({
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true
        }, 
        function (req, username, password, done) {
            db.GetUserByUsername(username, function (err, results) {
                if (err) {
                    return done(err);
                }

                if (results.length == 0) { // user tidak ada
                    return done(null, false);
                } else {
                    var user = results[0];
                    if (bcrypt.compareSync(password, user["password"])) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                }
            });
        })
    );

};
