var express     = require("express"),
    router      = express.Router(),
    db          = require("../models/database"),
    auth        = require("./auth.js"),
    MustLoginMW = auth.MustLoggedinMiddleware;

router.get("/", function (req, res) {
    res.send("Hello");
});

router.get("/add/:product_id", MustLoginMW, function (req, res) {
    var product_id = req.params.product_id,
        user_id    = req.user.id;

    db.GetActiveCart(user_id, make_AddCartGetActiveCart(
                                  req, res,
                                  product_id,
                                  user_id
                              ));
});

function make_AddCartGetActiveCart(req, res, product_id, user_id) {
    return function (err, results) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        if (results.length == 0) { // No existing cart
            db.CreateCart(user_id, make_CreateCart(
                                       req, res,
                                       product_id,
                                       user_id
                                   ));
        } else { // there's an existing cart
            db.AddItemToCart(results[0].id, 
                             product_id,
                             make_AddItemToCart(
                                 req, res,
                                 product_id,
                                 user_id
                             ));
        }
    };
};

function make_CreateCart(req, res, product_id, user_id) {
    return function (err, result) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        var newid = result.insertId;
        db.AddItemToCart(newid, product_id, make_AddItemToCart(
                                                req, res,
                                                product_id,
                                                user_id
                                            ));
    };
};

function make_AddItemToCart (req, res, product_id, user_id) {
    return function (err, result) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        req.flash("info", "New item added to cart!");
        res.redirect("/");
    };
};

exports.router = router;
