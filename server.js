var express  = require("express"),
    session  = require("express-session"),
    passport = require("passport"),
    flash    = require("connect-flash"),
    app      = express(),
    auth     = require("./src/routes/auth.js"),
    product  = require("./src/routes/product.js");

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

var JadeLoggedinMiddleware = auth.JadeLoggedinMiddleware;
app.use("*", JadeLoggedinMiddleware);

app.get("/", function (req, res) {
    var message = req.flash("success");
    if (message.length > 0) {
        res.render("index", {
            flashInfo: message
        });
    } else {
        res.render("index");
    }
});

var authRoute    = auth.router,
    productRoute = product.router;
app.use("/auth", authRoute);
app.use("/product", productRoute);

var server = app.listen(3000, "localhost", function () {
    console.log("Server started!");
});
