DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR (255),
    signature TEXT NOT NULL
);
