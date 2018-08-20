DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR (255)  NOT NULL,
    email VARCHAR (255) NOT NULL UNIQUE,
    hashedpassword VARCHAR NOT NULL
);
