const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/PackardBell");

exports.saveSignature = (firstname, lastname, signature) => {
    const q =
        "INSERT INTO signatures (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING *;";
    return db.query(q, [
        firstname || null,
        lastname || null,
        signature || null
    ]);
};

exports.getSignatureById = id => {
    const q = "SELECT signature FROM signatures WHERE id = ($1)";
    return db.query(q, [id]);
};

exports.lookForNames = lookForNames => {
    return db.query("SELECT firstname,lastname FROM signatures");
};
exports.saveUser = (firstname, lastname, email, hashedpassword) => {
    const q =
        "INSERT INTO users (firstname, lastname, email, hashedpassword) VALUES ($1, $2, $3, $4) RETURNING *;";
    return db.query(q, [
        firstname || null,
        lastname || null,
        email || null,
        hashedpassword || null
    ]);
};
exports.getUsers = function() {
    return db.query("SELECT * FROM users");
};
