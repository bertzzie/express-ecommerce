var express  = require("express"),
    session  = require("express-session"),
    passport = require("passport"),
    flash    = require("connect-flash"),
    app      = express(),
    auth     = require("./src/routes/auth.js"),
    product  = require("./src/routes/product.js"),
    cart     = require("./src/routes/cart.js"),
    db       = require("./src/models/database.js");

var SESSION_INFO = {
    secret: 'hasodir283471-jalnzxnfa',
    cookie: { maxAge: 3600 * 1000 },
    resave: true,
    saveUninitialized: false
};

app.use("/static", express.static("./src/static"));
app.use(session(SESSION_INFO));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require("./src/models/passport")(passport);

app.set("view engine", "jade");
app.set("views", "./src/views");

var JadeLoggedinMiddleware = auth.JadeLoggedinMiddleware,
    JadeUserMiddleware     = auth.JadeUserMiddleware;
app.use("*", JadeLoggedinMiddleware);
app.use("*", JadeUserMiddleware);

app.get("/", function (req, res) {
    var message  = req.flash("success");
    db.GetProductList(9, 
                      make_GetProductsIndex(req, res, message));
});

var authRoute    = auth.router,
    productRoute = product.router,
    cartRoute    = cart.router;
app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);

var server = app.listen(3000, "localhost", function () {
    console.log("Server started!");
});

function make_GetProductsIndex (req, res, message) {
    return function (err, results) {
        if (err) {
            console.log(err);
            return res.send(err);
        }

        var renderdata = {
            products: []
        };

        if (message.length > 0) {
            renderdata.flashInfo = message;
        }

        if (results.length > 0) {
            renderdata.products = results;
        }

        res.render("index", renderdata);
    };
};
