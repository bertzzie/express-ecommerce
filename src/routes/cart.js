var express     = require("express"),
    router      = express.Router(),
    db          = require("../models/database"),
    auth        = require("./auth.js"),
    MustLoginMW = auth.MustLoggedinMiddleware;

router.get("/", MustLoginMW, function (req, res) {
    var owner_id = req.user.id;

    db.GetActiveCartProduct(owner_id, function (err, results) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        var count = results.length, grand_total = 0;
        for (var i = 0; i < count; i++) {
            var total   = results[i].price * results[i].quantity;
            grand_total = grand_total + total;
        }

        res.render("cart/show", {
            CartItems: results,
            GrandTotal: grand_total
        });
    });
});

router.get("/checkout", MustLoginMW, function (req, res) {
    var owner_id = req.user.id;

    db.GetActiveCart(owner_id, make_CheckoutGetActiveCart(
                                   req, res,
                                   owner_id
                               ));
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

function make_CheckoutGetActiveCart(req, res, owner_id) {
    return function (err, results) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        var cartid = results[0].id;
        db.UpdateCartStatus(cartid, 3, function (uerr, result) {
            if (uerr) {
                console.log(uerr);
                return res.redirect("/");
            }

            req.flash("success", "Cart checkout success!");
            res.redirect("/");
        });
    };
};

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

        req.flash("success", "New item added to cart!");
        res.redirect("/");
    };
};

function CartCountMiddleware(req, res, next) {
    if (req.isAuthenticated()) {
        var owner = req.user.id;
        db.GetActiveCartProductCount(owner, function (err, results) {
            if (err) {
                console.log(err);
                return res.status(500).send("Internal Server Error");
            }

            res.locals.CartCount = results[0].CartContentCount;
            next();
        });
    } else {
        res.locals.CartCount = 0;
        next();
    }
};

exports.router = router;
exports.CartCountMiddleware = CartCountMiddleware;
