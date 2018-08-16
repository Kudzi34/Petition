const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/PackardBell");

exports.saveSignature = (firstname, lastname, signature) => {
    const q =
        "INSERT INTO signatures (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING *;";
    return db.query(q, [firstname, lastname, signature]);
};

exports.getSignatureById = id => {
    const q = "SELECT signature FROM signatures WHERE id = ($1)";
    return db.query(q, [id]);
};
