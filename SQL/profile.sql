DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles (
    id  SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    age INTEGER,
    city VARCHAR (255),
    homepage VARCHAR (255)
);
