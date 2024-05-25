-- clean up
DROP TABLE IF EXISTS blog_post_pet;
DROP TABLE IF EXISTS account_follow;
DROP TABLE IF EXISTS pet_follow;
DROP TABLE IF EXISTS post_like;
DROP TABLE IF EXISTS pet_own;
DROP TABLE IF EXISTS blog_tagged;
DROP TABLE IF EXISTS blog_post_picture;
DROP TABLE IF EXISTS blog_post;
DROP TABLE IF EXISTS pet;
DROP TABLE IF EXISTS pet_type;
DROP TABLE IF EXISTS blog_tag;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS picture;

DROP TYPE IF EXISTS sex;

DROP TRIGGER IF EXISTS trigger_post_like_count_increase ON post_like;
DROP TRIGGER IF EXISTS trigger_post_like_count_decrease ON post_like;
DROP TRIGGER IF EXISTS trigger_account_follower_count_increase ON account_follow;
DROP TRIGGER IF EXISTS trigger_account_follower_count_decrease ON account_follow;
DROP TRIGGER IF EXISTS trigger_account_followed_count_increase ON account_follow;
DROP TRIGGER IF EXISTS trigger_account_followed_count_decrease ON account_follow;
DROP TRIGGER IF EXISTS trigger_blog_post_count_increase ON blog_post;
DROP TRIGGER IF EXISTS trigger_blog_post_count_decrease ON blog_post;
DROP TRIGGER IF EXISTS trigger_reply_count_increase ON blog_post;
DROP TRIGGER IF EXISTS trigger_reply_count_decrease ON blog_post;
DROP TRIGGER IF EXISTS trigger_owned_pet_count_increase ON pet_own;
DROP TRIGGER IF EXISTS trigger_owned_pet_count_decrease ON pet_own;
DROP TRIGGER IF EXISTS trigger_pet_feature_count_increase ON pet_own;
DROP TRIGGER IF EXISTS trigger_pet_feature_count_decrease ON pet_own;
DROP TRIGGER IF EXISTS trigger_blog_tag_times_used_increase ON blog_tagged;
DROP TRIGGER IF EXISTS trigger_blog_tag_times_used_decrease ON blog_tagged;
DROP TRIGGER IF EXISTS trigger_pet_type_times_used_increase ON pet_type;
DROP TRIGGER IF EXISTS trigger_pet_type_times_used_decrease ON pet_type;

DROP FUNCTION IF EXISTS post_like_count_increase();
DROP FUNCTION IF EXISTS post_like_count_decrease();
DROP FUNCTION IF EXISTS account_follower_count_increase();
DROP FUNCTION IF EXISTS account_follower_count_decrease();
DROP FUNCTION IF EXISTS account_followed_count_increase();
DROP FUNCTION IF EXISTS account_followed_count_decrease();
DROP FUNCTION IF EXISTS pet_follower_count_increase();
DROP FUNCTION IF EXISTS pet_follower_count_decrease();
DROP FUNCTION IF EXISTS pet_followed_count_increase();
DROP FUNCTION IF EXISTS pet_followed_count_decrease();
DROP FUNCTION IF EXISTS blog_post_count_increase();
DROP FUNCTION IF EXISTS blog_post_count_decrease();
DROP FUNCTION IF EXISTS reply_count_increase();
DROP FUNCTION IF EXISTS reply_count_decrease();
DROP FUNCTION IF EXISTS owned_pet_count_increase();
DROP FUNCTION IF EXISTS owned_pet_count_decrease();
DROP FUNCTION IF EXISTS blog_tag_times_used_increase();
DROP FUNCTION IF EXISTS blog_tag_times_used_decrease();
DROP FUNCTION IF EXISTS pet_type_times_used_increase();
DROP FUNCTION IF EXISTS pet_type_times_used_decrease();
DROP FUNCTION IF EXISTS pet_feature_count_increase();
DROP FUNCTION IF EXISTS pet_feature_count_decrease();

-- types
CREATE TYPE sex AS ENUM ('m', 'f', 'na');

-- main tables
CREATE TABLE picture (
    id serial PRIMARY KEY,
    picture_path char(23)
);

CREATE TABLE user_account (
    id serial PRIMARY KEY,
    account_name varchar(50) UNIQUE,
    email varchar(254) UNIQUE,
    password char(60),
    
    display_name varchar(50),
    profile_picture_id int NULL REFERENCES picture(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    bio varchar(300) NULL,

    likes_visible boolean DEFAULT TRUE,
    followed_visible boolean DEFAULT TRUE,

    follower_count int DEFAULT 0,
    accounts_followed_count int DEFAULT 0,
    pets_followed_count int DEFAULT 0,
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

CREATE TABLE pet_type (
    id serial PRIMARY KEY,
    type_name varchar(50) UNIQUE,
    times_used int DEFAULT 0
);

CREATE TABLE pet (
    id serial PRIMARY KEY,
    name varchar(50) UNIQUE,
    sex sex DEFAULT 'na',
    date_created timestamptz DEFAULT NOW(),

    follower_count int DEFAULT 0,
    feature_count int DEFAULT 0,

    profile_picture_id int NULL REFERENCES picture(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    type_id int NULL REFERENCES pet_type(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE blog_tag (
    id serial PRIMARY KEY,
    tag_name varchar(50),
    times_used int DEFAULT 0
);


-- join tables
CREATE TABLE account_follow (
    follower_id int REFERENCES user_account(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    followed_id int REFERENCES user_account(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (follower_id, followed_id),
    CONSTRAINT chk_follow_ids_not_equal CHECK (follower_id <> followed_id),

    date_followed timestamptz DEFAULT NOW()
);

CREATE TABLE pet_follow (
    follower_id int REFERENCES user_account(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    pet_id int REFERENCES pet(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (follower_id, pet_id),

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

CREATE TABLE blog_post_pet (
    pet_id int REFERENCES pet(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    post_id int REFERENCES blog_post(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (pet_id, post_id)
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
-- post like
CREATE FUNCTION post_like_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE blog_post
    SET like_count = like_count + 1
    WHERE id = NEW.post_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION post_like_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE blog_post
    SET like_count = like_count - 1
    WHERE id = OLD.post_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- account follower count
CREATE FUNCTION account_follower_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET follower_count = follower_count + 1
    WHERE id = NEW.followed_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION account_follower_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET follower_count = follower_count - 1
    WHERE id = OLD.followed_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- account followed count
CREATE FUNCTION account_followed_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET accounts_followed_count = accounts_followed_count + 1
    WHERE id = NEW.follower_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION account_followed_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET accounts_followed_count = accounts_followed_count - 1
    WHERE id = OLD.follower_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- pet follower count
CREATE FUNCTION pet_follower_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE pet
    SET follower_count = follower_count + 1
    WHERE id = NEW.pet_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION pet_follower_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE pet
    SET follower_count = follower_count - 1
    WHERE id = OLD.pet_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- pets followed count
CREATE FUNCTION pet_followed_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET pets_followed_count = pets_followed_count + 1
    WHERE id = NEW.follower_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION pet_followed_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET pets_followed_count = pets_followed_count - 1
    WHERE id = OLD.follower_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- blog post count
CREATE FUNCTION blog_post_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET blog_post_count = blog_post_count + 1
    WHERE id = NEW.poster_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION blog_post_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET blog_post_count = blog_post_count - 1
    WHERE id = OLD.poster_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- reply count
CREATE FUNCTION reply_count_increase() RETURNS TRIGGER AS $$
BEGIN
IF NEW.reply_to IS NOT NULL THEN
    UPDATE user_account
    SET reply_count = reply_count + 1
    WHERE id = NEW.poster_id;

    RETURN NULL;
ELSE 
    RETURN NULL;
END IF;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION reply_count_decrease() RETURNS TRIGGER AS $$
BEGIN
IF OLD.reply_to IS NOT NULL THEN
    UPDATE user_account
    SET reply_count = reply_count - 1
    WHERE id = OLD.poster_id;

    RETURN NULL;
ELSE
    RETURN NULL;
END IF;
END; $$ LANGUAGE plpgsql;

-- owned pet count
CREATE FUNCTION owned_pet_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET owned_pet_count = owned_pet_count + 1
    WHERE id = NEW.owner_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION owned_pet_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_account
    SET owned_pet_count = owned_pet_count - 1
    WHERE id = OLD.owner_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- pet feature count
CREATE FUNCTION pet_feature_count_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE pet
    SET feature_count = feature_count + 1
    WHERE id = NEW.pet_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION pet_feature_count_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE pet
    SET feature_count = feature_count - 1
    WHERE id = OLD.pet_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- blog tag times used count
CREATE FUNCTION blog_tag_times_used_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE blog_tag
    SET times_used = times_used + 1
    WHERE id = NEW.tag_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION blog_tag_times_used_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE blog_tag
    SET times_used = times_used - 1
    WHERE id = OLD.tag_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- pet type times used
CREATE FUNCTION pet_type_times_used_increase() RETURNS TRIGGER AS $$
BEGIN
    UPDATE pet_type
    SET times_used = times_used + 1
    WHERE id = NEW.type_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

CREATE FUNCTION pet_type_times_used_decrease() RETURNS TRIGGER AS $$
BEGIN
    UPDATE pet_type
    SET times_used = times_used - 1
    WHERE id = OLD.type_id;

    RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- triggers
CREATE TRIGGER trigger_post_like_count_increase AFTER INSERT ON post_like FOR EACH ROW EXECUTE FUNCTION post_like_count_increase();
CREATE TRIGGER trigger_post_like_count_decrease AFTER DELETE ON post_like FOR EACH ROW EXECUTE FUNCTION post_like_count_decrease();

CREATE TRIGGER trigger_account_follower_count_increase AFTER INSERT ON account_follow FOR EACH ROW EXECUTE FUNCTION account_follower_count_increase();
CREATE TRIGGER trigger_account_follower_count_decrease AFTER DELETE ON account_follow FOR EACH ROW EXECUTE FUNCTION account_follower_count_decrease();

CREATE TRIGGER trigger_account_followed_count_increase AFTER INSERT ON account_follow FOR EACH ROW EXECUTE FUNCTION account_followed_count_increase();
CREATE TRIGGER trigger_account_followed_count_decrease AFTER DELETE ON account_follow FOR EACH ROW EXECUTE FUNCTION account_followed_count_decrease();

CREATE TRIGGER trigger_follower_count_increase AFTER INSERT ON pet_follow FOR EACH ROW EXECUTE FUNCTION pet_follower_count_increase();
CREATE TRIGGER trigger_follower_count_decrease AFTER DELETE ON pet_follow FOR EACH ROW EXECUTE FUNCTION pet_follower_count_decrease();

CREATE TRIGGER trigger_followed_count_increase AFTER INSERT ON account_follow FOR EACH ROW EXECUTE FUNCTION account_followed_count_increase();
CREATE TRIGGER trigger_followed_count_decrease AFTER DELETE ON account_follow FOR EACH ROW EXECUTE FUNCTION account_followed_count_decrease();

CREATE TRIGGER trigger_blog_post_count_increase AFTER INSERT ON blog_post FOR EACH ROW EXECUTE FUNCTION blog_post_count_increase();
CREATE TRIGGER trigger_blog_post_count_decrease AFTER DELETE ON blog_post FOR EACH ROW EXECUTE FUNCTION blog_post_count_decrease();

CREATE TRIGGER trigger_reply_count_increase AFTER INSERT ON blog_post FOR EACH ROW EXECUTE FUNCTION reply_count_increase();
CREATE TRIGGER trigger_reply_count_decrease AFTER DELETE ON blog_post FOR EACH ROW EXECUTE FUNCTION reply_count_decrease();

CREATE TRIGGER trigger_owned_pet_count_increase AFTER INSERT ON pet_own FOR EACH ROW EXECUTE FUNCTION owned_pet_count_increase();
CREATE TRIGGER trigger_owned_pet_count_decrease AFTER DELETE ON pet_own FOR EACH ROW EXECUTE FUNCTION owned_pet_count_decrease();

CREATE TRIGGER trigger_pet_feature_count_increase AFTER INSERT ON blog_post_pet FOR EACH ROW EXECUTE FUNCTION pet_feature_count_increase();
CREATE TRIGGER trigger_pet_feature_count_decrease AFTER DELETE ON blog_post_pet FOR EACH ROW EXECUTE FUNCTION pet_feature_count_decrease();

CREATE TRIGGER trigger_blog_tag_times_used_increase AFTER INSERT ON blog_tagged FOR EACH ROW EXECUTE FUNCTION blog_tag_times_used_increase();
CREATE TRIGGER trigger_blog_tag_times_used_decrease AFTER DELETE ON blog_tagged FOR EACH ROW EXECUTE FUNCTION blog_tag_times_used_decrease();

CREATE TRIGGER trigger_pet_type_times_used_increase AFTER INSERT ON pet FOR EACH ROW EXECUTE FUNCTION pet_type_times_used_increase();
CREATE TRIGGER trigger_pet_type_times_used_decrease AFTER DELETE ON pet FOR EACH ROW EXECUTE FUNCTION pet_type_times_used_decrease();