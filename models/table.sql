CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    photo VARCHAR,
    cover VARCHAR,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR(12) NOT NULL,
    role VARCHAR,
    created_at TIMESTAMP,
    is_deleted SMALLINT DEFAULT 0
);
CREATE TABLE page (
    id SERIAL PRIMARY KEY,
    photo VARCHAR,
    cover VARCHAR,
    user-id INTEGER,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR(12) NOT NULL,
    role VARCHAR,
    FOREIGN Key user_id REFERENCES users(id),
    created_at TIMESTAMP,
    is_deleted SMALLINT DEFAULT 0
);
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    video VARCHAR,
    body TEXT,
    user_id INTEGER photo VARCHAR,
    created_at TIMESTAMP,
    FOREIGN KEY user_id REFERENCES users(id),
    is_deleted SMALLINT DEFAULT 0
);
CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    comment VARCHAR,
    post_id INTEGER story_id INTEGER,
    reels_id INTEGER created_at TIMESTAMP,
    FOREIGN KEY post_id REFERENCES posts(id) FOREIGN KEY story_id REFERENCES story(id) FOREIGN KEY reels_id REFERENCES reels(id),
    is_deleted SMALLINT DEFAULT 0
);
CREATE TABLE story (
    id SERIAL PRIMARY KEY,
    photo_video VARCHAR,
    user_id INTEGER NOT NULL,
    comment_id INTEGER,
    created_at TIMESTAMP,
    FOREIGN Key user_id REFERENCES users(id),
    is_deleted SMALLINT DEFAULT 0
);
CREATE TABLE reels (
    id SERIAL PRIMARY KEY,
    comment VARCHAR,
    user_id INTEGER,
    created_at TIMESTAMP,
    FOREIGN Key user_id REFERENCES users(id),
    is_deleted SMALLINT DEFAULT 0
);
CREATE TABLE follows (
    following_user_id INTEGER,
    followed_user_id INTEGER ,
    created_at TIMESTAMP ,
    FOREIGN Key following_user_id REFERENCES users(id),
    FOREIGN Key followed_user_id REFERENCES users(id),
     is_deleted SMALLINT DEFAULT 0
);