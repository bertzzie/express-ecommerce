var mysql  = require("mysql"),
    bcrypt = require("bcrypt"),
    pool   = mysql.createPool({
        host: process.env.MARIADB_HOST,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DB_ECOMMERCE,
        connectionLimit: 10,
        supportBigNumbers: true
    });

exports.USER_TYPE = {
    "ADMIN": 1,
    "USER" : 2,
    "STAFF": 3
};

exports.GetUserByID = function (id, callback) {
    var query = "SELECT * FROM users WHERE users.id = ?";

    queryDatabase(query, [id], callback);
};

exports.GetUserByUsername = function (uname, callback) {
    var query = "SELECT * FROM users WHERE users.username = ?";

    queryDatabase(query, [uname], callback);
};

exports.CreateUser = function (uname, passw, type, callback) {
    var query = "INSERT INTO users (username, password, type) " +
                "VALUES (?, ?, ?);",
        salt  = bcrypt.genSaltSync(10),
        hash  = bcrypt.hashSync(passw, salt);

    queryDatabase(query, [uname, hash, type], callback);
};

exports.CreateProduct = function (product, callback) {
    var query = "INSERT INTO products (name, description, quantity, price, picture)" +
                "VALUES (?, ?, ?, ?, ?);";

    queryDatabase(query, 
                  [
                      product.name, 
                      product.description, 
                      product.quantity,
                      product.price,
                      product.picture
                  ], 
                  callback);
};

exports.GetProductList = function (count, callback) {
    var query = "SELECT * FROM products LIMIT ?",
        limit = count > 0? count: 1;

    queryDatabase(query, [limit], callback);
};

exports.GetActiveCart = function (owner_id, callback) {
    // There can only be one (!)
    // non-checkoutted (status: 3) cart
    var query = "SELECT * FROM carts " + 
                "WHERE carts.owner = ? AND carts.status != 3";

    queryDatabase(query, [owner_id], callback);
};

exports.GetActiveCartProductCount = function (owner_id, callback) {
    var query = "SELECT COUNT(cp.productid) AS CartContentCount " +
                "FROM carts c " +
                "LEFT JOIN cartproducts cp ON c.id = cp.cartid " +
                "WHERE c.owner = ? AND c.status = 2"; // 2 == filled

    queryDatabase(query, [owner_id], callback);
};

exports.CreateCart = function (owner_id, callback) {
    var query = "INSERT INTO carts (owner, created, status) " +
                "VALUES (?, NOW(), 1);"; // 1 == empty cart

    queryDatabase(query, [owner_id], callback);
};

exports.UpdateCartStatus = function (cart_id, new_status, callback) {
    var query = "UPDATE carts SET carts.status = ? " +
                "WHERE carts.id = ?";

    queryDatabase(query, [new_status, cart_id], callback);
};

exports.AddItemToCart = function (cart_id, product_id, callback) {
    var query = "INSERT INTO cartproducts (cartid, productid) " +
                "VALUES (?, ?);";

    exports.UpdateCartStatus(cart_id, 2, function (err, result) {
        if (err) {
            console.log(err);
            return callback(err);
        }

        queryDatabase(query, [cart_id, product_id], callback);
    });
};

function queryDatabase(query, data, callback) {
    pool.getConnection(function (poolError, connection) {
        if (poolError) {
            callback(poolError);
            return;
        }

        connection.query(query, data, function (connErr, results) {
            connection.release();
            if (connErr) {
                callback(connErr);
                return;
            }

            callback(false, results);
        });
    });
};
