CREATE TABLE roles (
  id SERIAL NOT NULL,
  role VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE permissions (
  id SERIAL NOT NULL,
  permission VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE role_permission (
  id SERIAL NOT NULL,
  role_id INT,
  permission_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id),
  PRIMARY KEY (id)
);
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  photo VARCHAR,
  cover VARCHAR,
  user_id INTEGER,
  name_Page VARCHAR NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  is_deleted SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  video VARCHAR,
  body VARCHAR,
  user_id INTEGER,
  pic VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  is_deleted SMALLINT DEFAULT 0
);
CREATE TABLE comment_posts(
  id SERIAL PRIMARY KEY,
  comment VARCHAR,
  commenter INTEGER,
  post_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  is_deleted SMALLINT DEFAULT 0,
  FOREIGN KEY (commenter) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);
CREATE TABLE story (
  id SERIAL PRIMARY KEY,
  photo VARCHAR,
  video VARCHAR,
  user_id INT,
  created_at TIMESTAMP DEFAULT NOW(),
  end_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  is_deleted SMALLINT DEFAULT 0
);


CREATE TABLE comment_story(
  id SERIAL PRIMARY KEY,
  comment VARCHAR,
  commenter INTEGER,
  story_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  is_deleted SMALLINT DEFAULT 0,
  FOREIGN KEY (commenter) REFERENCES users(id),
  FOREIGN KEY (story_id) REFERENCES story(id)
);
CREATE TABLE reels (
  id SERIAL PRIMARY KEY,
  video VARCHAR NOT NULL,
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN Key (user_id) REFERENCES users(id),
  is_deleted SMALLINT DEFAULT 0
);
CREATE TABLE comment_reel(
  id SERIAL PRIMARY KEY,
  comment VARCHAR,
  commenter INTEGER,
  reel_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  is_deleted SMALLINT DEFAULT 0,
  FOREIGN KEY (commenter) REFERENCES users(id),
  FOREIGN KEY (reel_id) REFERENCES reels(id)
);
CREATE TABLE users(
  id SERIAL NOT NULL,
  photo VARCHAR,
  cover VARCHAR,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  age INT,
  country VARCHAR(255),
  password VARCHAR(255),
  role_id INT,
  is_deleted SMALLINT DEFAULT 0,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  PRIMARY KEY (id)
);
CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  following_user_id INTEGER,
  followed_user_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  is_deleted SMALLINT DEFAULT 0,
  FOREIGN KEY (following_user_id) REFERENCES users(id),
  FOREIGN KEY (followed_user_id) REFERENCES users(id)
);
CREATE TABLE likes (
  like_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INTEGER,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE messages(
  message_id SERIAL PRIMARY KEY,
  receiver_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  messages VARCHAR(255),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
)
INSERT INTO roles (role)
VALUES ('Admin');
INSERT INTO permissions (permission)
VALUES ('CREATE_POST');
INSERT INTO permissions (permission)
VALUES ('CREATE_COMMENT');
INSERT INTO permissions (permission)
VALUES ('CREATE_REEL');
INSERT INTO permissions (permission)
VALUES ('CREATE_STORY');
INSERT INTO permissions (permission)
VALUES ('CREATE_COMMENT');
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 1);
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 2);
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 3);
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 4);