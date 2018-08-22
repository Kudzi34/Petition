const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/PackardBell");

exports.saveSignature = (user_id, signature) => {
    const q =
        "INSERT INTO signatures ( user_id, signature) VALUES ($1, $2) RETURNING *;";
    return db.query(q, [user_id, signature || null]);
};

exports.getSignatureById = id => {
    const q = "SELECT signature FROM signatures WHERE id = ($1)";
    return db.query(q, [id]);
};

exports.lookForNames = lookForNames => {
    return db.query(
        "SELECT users.firstname, users.lastname, user_profiles.age, user_profiles.city, user_profiles.homepage FROM users JOIN user_profiles ON users.id = user_profiles.userId"
    );
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
exports.saveProfile = (userId, city, age, homepage) => {
    const q =
        "INSERT INTO user_profiles (userId, city, age, homepage) VALUES ($1, $2, $3, $4) RETURNING *;";
    return db.query(q, [userId, city, age, homepage]);
};

exports.lookForCity = city => {
    const q =
        "SELECT users.firstname, users.lastname, user_profiles.age, user_profiles.city, user_profiles.homepage FROM users JOIN user_profiles ON users.id = user_profiles.userId WHERE city = ($1)";
    return db.query(q, [city]);
};
exports.editProfile = user_id => {
    const q = `
        SELECT users.firstname, users.lastname, users.email, user_profiles.age, user_profiles.city, user_profiles.homepage
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.userid
        WHERE users.id = ($1);
        `;
    return db.query(q, [user_id]);
};
