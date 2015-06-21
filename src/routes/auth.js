var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    bodyparser = require("body-parser"),
    db         = require("../models/database");

var urlEncodedParser = bodyparser.urlencoded({extended: true});

router.get("/login", function (req, res) {
    var err = req.flash("error");
    if (err.length > 0) {
        res.render("auth/login", {
            flashError: err
        });
    } else {
        res.render("auth/login");
    }
});

router.post("/login", urlEncodedParser, passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: "Login Gagal. Silahkan coba lagi.",
    successFlash: "Login berhasil. Selamat datang!",
}));

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

router.get("/register", function (req, res) {
    res.render("auth/register");
});

router.post("/register", urlEncodedParser, function (req, res) {
    var username = req.body["username"],
        password = req.body["password"],
        retpass  = req.body["retype-password"];

    if (password === retpass) {
        db.GetUserByUsername(username, 
                             make_GetUserByUserName_Register(req, 
                                                             res, 
                                                             username, 
                                                             password));
    } else {
        res.render("auth/register", {
            flashError: "Password dan Retype Password don't match"
        });
    }
});

function make_GetUserByUserName_Register(req, res, username, password) {
    return function (err, results) {
        if (err) {
            console.log(err);
            res.render("auth/register", {
                flashError: "Database error"
            });
            return;
        }

        if (results.length > 0) {
            res.render("auth/register", {
                flashError: "User telah ada"
            });
            return;
        } else {
            db.CreateUser(username, 
                          password, 
                          db.USER_TYPE["USER"], 
                          make_CreateUser_Register(req, res));
        }
    }
};

function make_CreateUser_Register(req, res) {
    return function (cerr, results) {
        if (cerr) {
            console.log(cerr);
            res.render("auth/register", {
                flashError: "Database error"
            });
            return;
        }

        return res.redirect("/");
    };
};

function JadeLoggedinMiddleware(req, res, next) {
    res.locals.loggedin = req.isAuthenticated();

    next();
};

exports.router = router;
exports.JadeLoggedinMiddleware = JadeLoggedinMiddleware;
