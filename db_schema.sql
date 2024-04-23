-- clean up
DROP TABLE IF EXISTS follow;
DROP TABLE IF EXISTS post_like;
DROP TABLE IF EXISTS pet_own;
DROP TABLE IF EXISTS blog_tagged;
DROP TABLE IF EXISTS blog_post_picture;
DROP TABLE IF EXISTS blog_post;
DROP TABLE IF EXISTS picture;
DROP TABLE IF EXISTS pet;
DROP TABLE IF EXISTS pet_type;
DROP TABLE IF EXISTS blog_tag;
DROP TABLE IF EXISTS user_account;

DROP TYPE IF EXISTS sex;

DROP TRIGGER IF EXISTS trigger_follower_count_increase ON follow;
DROP TRIGGER IF EXISTS trigger_follower_count_decrease ON follow;
DROP TRIGGER IF EXISTS trigger_followed_count_increase ON follow;
DROP TRIGGER IF EXISTS trigger_followed_count_decrease ON follow;
DROP TRIGGER IF EXISTS trigger_blog_post_count_increase ON blog_post;
DROP TRIGGER IF EXISTS trigger_blog_post_count_decrease ON blog_post;
DROP TRIGGER IF EXISTS trigger_reply_count_increase ON blog_post;
DROP TRIGGER IF EXISTS trigger_reply_count_decrease ON blog_post;
DROP TRIGGER IF EXISTS trigger_owned_pet_count_increase ON pet_own;
DROP TRIGGER IF EXISTS trigger_owned_pet_count_decrease ON pet_own;

DROP FUNCTION IF EXISTS follower_count_increase();
DROP FUNCTION IF EXISTS follower_count_decrease();
DROP FUNCTION IF EXISTS followed_count_increase();
DROP FUNCTION IF EXISTS followed_count_decrease();
DROP FUNCTION IF EXISTS blog_post_count_increase();
DROP FUNCTION IF EXISTS blog_post_count_decrease();
DROP FUNCTION IF EXISTS reply_count_increase();
DROP FUNCTION IF EXISTS reply_count_decrease();
DROP FUNCTION IF EXISTS owned_pet_count_increase();
DROP FUNCTION IF EXISTS owned_pet_count_decrease();


-- types
CREATE TYPE sex AS ENUM ('m', 'f', 'n/a');


-- main tables
CREATE TABLE user_account (
    id serial PRIMARY KEY,
    account_name varchar(50) UNIQUE,
    email varchar(254) UNIQUE,
    password char(60),
    
    display_name varchar(50),
    profile_picture_id int,
    bio varchar(300) NULL,

    likes_visible boolean DEFAULT TRUE,

    follower_count int DEFAULT 0,
    followed_count int DEFAULT 0,
    blog_post_count int DEFAULT 0,
    reply_count int DEFAULT 0,
    owned_pet_count int DEFAULT 0,

    date_created timestamptz DEFAULT NOW()
);

CREATE TABLE blog_post (
    id serial PRIMARY KEY,
    poster_id int REFERENCES user_account(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    contents varchar(150),
    reply_to int NULL,


    like_count int DEFAULT 0,
    reply_count int DEFAULT 0,
    
    date_posted timestamptz DEFAULT NOW()
);

CREATE TABLE picture (
    id serial PRIMARY KEY,
    picture_path char(23)
);

CREATE TABLE pet (
    id serial PRIMARY KEY,
    name varchar(50),
    sex sex DEFAULT 'n/a'
);

CREATE TABLE pet_type (
    id serial PRIMARY KEY,
    name varchar(50)
);


CREATE TABLE blog_tag (
    id serial PRIMARY KEY,
    tag_name varchar(50)
);


-- join tables
CREATE TABLE follow (
    follower_id int REFERENCES user_account(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    followed_id int REFERENCES user_account(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (follower_id, followed_id),
    CONSTRAINT chk_follow_ids_not_equal CHECK (follower_id <> followed_id),

    date_followed timestamptz DEFAULT NOW()
);

CREATE TABLE post_like (
    user_account_id int REFERENCES user_account(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    post_id int REFERENCES blog_post(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (user_account_id, post_id),

    date_liked timestamptz DEFAULT NOW()
);


CREATE TABLE pet_own (
    pet_id int REFERENCES pet(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    owner_id int REFERENCES user_account(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (pet_id, owner_id)
);


CREATE TABLE blog_tagged (
    tag_id int REFERENCES blog_tag(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    post_id int REFERENCES blog_post(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (tag_id, post_id)
);

CREATE TABLE blog_post_picture (
    picture_id int REFERENCES picture(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    post_id int REFERENCES blog_post(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (picture_id, post_id)
);


-- functions
-- follower count
CREATE FUNCTION follower_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET follower_count = follower_count + 1
    WHERE id = NEW.followed_id;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION follower_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET follower_count = follower_count - 1
    WHERE id = OLD.follower_id;
END; $$ LANGUAGE plpgsql;

-- followed count
CREATE FUNCTION followed_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET followed_count = followed_count + 1
    WHERE id = NEW.follower_id;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION followed_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET followed_count = followed_count - 1
    WHERE id = OLD.followed_id;
END; $$ LANGUAGE plpgsql;

-- blog post count
CREATE FUNCTION blog_post_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET blog_post_count = blog_post_count + 1
    WHERE id = NEW.poster_id;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION blog_post_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET blog_post_count = blog_post_count - 1
    WHERE id = OLD.poster_id;
END; $$ LANGUAGE plpgsql;

-- reply count
CREATE FUNCTION reply_count_increase() RETURNS TRIGGER AS $$
BEGIN
IF NEW.reply_to IS NOT NULL THEN
    UPDATE user_account
    SET reply_count = reply_count + 1
    WHERE id = NEW.poster_id;
END IF;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION reply_count_decrease() RETURNS TRIGGER AS $$
BEGIN
IF OLD.reply_to IS NOT NULL THEN
    UPDATE user_account
    SET reply_count = reply_count - 1
    WHERE id = OLD.poster_id;
END IF;
END; $$ LANGUAGE plpgsql;

-- owned pet count
CREATE FUNCTION owned_pet_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET owned_pet_count = owned_pet_count + 1
    WHERE id = NEW.owner_id;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION owned_pet_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET owned_pet_count = owned_pet_count - 1
    WHERE id = OLD.owner_id;
END; $$ LANGUAGE plpgsql;


-- triggers
CREATE TRIGGER trigger_follower_count_increase AFTER INSERT ON follow FOR EACH ROW EXECUTE FUNCTION follower_count_increase();
CREATE TRIGGER trigger_follower_count_decrease AFTER DELETE ON follow FOR EACH ROW EXECUTE FUNCTION follower_count_decrease();

CREATE TRIGGER trigger_followed_count_increase AFTER INSERT ON follow FOR EACH ROW EXECUTE FUNCTION followed_count_increase();
CREATE TRIGGER trigger_followed_count_decrease AFTER DELETE ON follow FOR EACH ROW EXECUTE FUNCTION followed_count_decrease();

CREATE TRIGGER trigger_blog_post_count_increase AFTER INSERT ON blog_post FOR EACH ROW EXECUTE FUNCTION blog_post_count_increase();
CREATE TRIGGER trigger_blog_post_count_decrease AFTER DELETE ON blog_post FOR EACH ROW EXECUTE FUNCTION blog_post_count_decrease();

CREATE TRIGGER trigger_reply_count_increase AFTER INSERT ON blog_post FOR EACH ROW EXECUTE FUNCTION reply_count_increase();
CREATE TRIGGER trigger_reply_count_decrease AFTER DELETE ON blog_post FOR EACH ROW EXECUTE FUNCTION reply_count_decrease();

CREATE TRIGGER trigger_owned_pet_count_increase AFTER INSERT ON pet_own FOR EACH ROW EXECUTE FUNCTION owned_pet_count_increase();
CREATE TRIGGER trigger_owned_pet_count_decrease AFTER DELETE ON pet_own FOR EACH ROW EXECUTE FUNCTION owned_pet_count_decrease();