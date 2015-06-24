var express    = require("express"),
    router     = express.Router(),
    multiparty = require("multiparty"),
    fs         = require("fs"),
    db         = require("../models/database");

var PICT_DIR = "/static/product/";

router.get("/list", function (req, res) {
    db.GetProductList(10, function (err, results) {
        res.render("product/list", {
            products: results
        });
    });
});

router.get("/create", function (req, res) {
    var success = req.flash("success");
    if (success.length > 0) {
        res.render("product/create", {
            flashInfo: success
        });
    } else {
        res.render("product/create");
    }
});

router.post("/create", function (req, res) {
    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {
        var name  = fields["name"],
            qty   = fields["quantity"],
            price = fields["price"],
            desc  = fields["description"],
            pict  = files["picture"],
            ppath = __dirname + "/../static/product/" + pict[0]["originalFilename"];

        var product = {
            "name": name,
            "description": desc,
            "quantity": qty,
            "price": price,
            "picture": PICT_DIR + pict[0]["originalFilename"]
        };


        var rs = fs.createReadStream(pict[0]["path"]),
            ws = fs.createWriteStream(ppath);

        rs.on("error", function (err) {
            console.log(err);
            req.flash("error", "Product addition failed!");
            res.redirect("/product/create");
        });

        ws.on("error", function (err) {
            req.flash("error", "Product addition failed!");
            res.redirect("/product/create");
            console.log(err);
        });
        rs.pipe(ws);

        db.CreateProduct(product, make_CreateProduct(req, res));
    });
});

function make_CreateProduct(req, res) {
    return function (err, results) {
        req.flash("success", "Product added!");
        res.redirect("/product/create");
    };
};

exports.router = router;

