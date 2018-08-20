DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR (255)  NOT NULL,
    signature TEXT NOT NULL,
    user_id INTEGER NOT NULL
);
