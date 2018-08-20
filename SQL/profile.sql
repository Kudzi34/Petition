DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles (
    id  SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES users(id),
    age INTEGER,
    city VARCHAR (255),
    homepage VARCHAR (255)
);
