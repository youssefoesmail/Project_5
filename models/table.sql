CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    photo VARCHAR,
    cover VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR UNIQUE,
    password VARCHAR(12),
    role VARCHAR,
    created_at TIMESTAMP
);
CREATE TABLE page (
    id SERIAL PRIMARY KEY,
    photo VARCHAR,
    cover VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR UNIQUE,
    password VARCHAR(12),
    role VARCHAR,
    created_at TIMESTAMP
);
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    video VARCHAR,
    body TEXT,
    user_id INTEGER photo VARCHAR,
    created_at TIMESTAMP,
    FOREIGN KEY user_id REFERENCES users(id),
);
CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    comment VARCHAR,
    post_id INTEGER story_id INTEGER,
    reels_id INTEGER created_at TIMESTAMP,
    FOREIGN KEY post_id REFERENCES posts(id) FOREIGN KEY story_id REFERENCES story(id) FOREIGN KEY reels_id REFERENCES reels(id)
);
CREATE TABLE story (
    id SERIAL PRIMARY KEY,
    photo_video VARCHAR,
    user_id INTEGER,
    comment_id INTEGER,
    created_at TIMESTAMP,
    FOREIGN Key user_id REFERENCES users(id)
);
CREATE TABLE reels (
    id SERIAL PRIMARY KEY,
    comment VARCHAR,
    user_id INTEGER,
    created_at TIMESTAMP,
    FOREIGN Key user_id REFERENCES users(id)
);
CREATE TABLE follows (
    following_user_id INTEGER,
    followed_user_id INTEGER ,
    created_at TIMESTAMP ,
    FOREIGN Key following_user_id REFERENCES users(id),
     FOREIGN Key followed_user_id REFERENCES users(id)
);