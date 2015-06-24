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

function queryDatabase(query, data, callback) {
    pool.getConnection(function (poolError, connection) {
        if (poolError) {
            callback(poolError);
            return;
        }

        connection.query(query, data, function (connErr, results) {
            if (connErr) {
                callback(connErr);
                return;
            }

            callback(false, results);
        });
    });
};
