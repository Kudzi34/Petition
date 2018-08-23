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
        "SELECT users.firstname, users.lastname, user_profiles.age, user_profiles.city, user_profiles.homepage FROM users JOIN user_profiles ON users.id = user_profiles.user_id"
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
exports.saveProfile = (user_id, city, age, homepage) => {
    const q =
        "INSERT INTO user_profiles (user_id, city, age, homepage) VALUES ($1, $2, $3, $4) RETURNING *;";
    return db.query(q, [user_id, city, age, homepage]);
};

exports.lookForCity = city => {
    const q =
        "SELECT users.firstname, users.lastname, user_profiles.age, user_profiles.city, user_profiles.homepage FROM users JOIN user_profiles ON users.id = user_profiles.user_id WHERE city = ($1)";
    return db.query(q, [city]);
};
exports.editProfile = user_id => {
    const q = `
        SELECT users.firstname, users.lastname, users.email, user_profiles.age, user_profiles.city, user_profiles.homepage
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE users.id = ($1);
        `;
    return db.query(q, [user_id]);
};

exports.updateUserTableWithoutPassword = (id, firstname, lastname, email) => {
    const q = `
     UPDATE users
    SET firstname = $2, lastname = $3, email = $4
    WHERE id = $1
    `;
    return db.query(q, [id, firstname, lastname, email]);
};

exports.updateUserTable = (id, firstname, lastname, email, hashedpassword) => {
    const q = `
    UPDATE users SET firstname = $2, lastname = $3, email = $4, hashedpassword = $5
    WHERE id = $1
    `;
    return db.query(q, [id, firstname, lastname, email, hashedpassword]);
};

exports.updateProfileTable = (age, city, homepage, user_id) => {
    console.log(age, city, homepage, user_id);
    const q = `
    INSERT INTO user_profiles (age, city, homepage, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, city = $2, homepage = $3
    `;
    return db.query(q, [age, city, homepage, user_id]);
};
