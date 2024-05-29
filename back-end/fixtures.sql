-- sample pet types (5)
INSERT INTO pet_type (type_name)
VALUES 
    ('Dog'), -- 1
    ('Cat'),  -- 2
    ('Parrot'), -- 3
    ('Eagle'), -- 4
    ('Snail'), -- 5
    ('Frog'); -- 6

-- sample tags (8)
INSERT INTO blog_tag (tag_name)
VALUES 
    ('Baby'), -- 1
    ('Two'), -- 2
    ('Three'), -- 3
    ('Friends'), -- 4
    ('Cat and dog'), -- 5
    ('Bird'), -- 6
    ('Flying'), --7
    ('Wilderness'); -- 8

-- sample pictures (24)
INSERT INTO picture (picture_path)
VALUES
    ('big_dog_pfp_-0000000000'), -- 1
    ('big-dog-baby-0000000000'), -- 2
    ('big-dog-hunt-0000000000'), -- 3
    ('bird_acc_pfp-0000000000'), -- 4
    ('cat_acc_pfp_-0000000000'), -- 5
    ('cat_pfp_____-0000000000'), -- 6
    ('cat-and-dog_-0000000000'), -- 7
    ('cat-kitten__-0000000000'), -- 8
    ('cat-standing-0000000000'), -- 9
    ('dog_acc_pfp_-0000000000'), -- 10
    ('eagle_pfp___-0000000000'), -- 11
    ('eagle-flies_-0000000000'), -- 12
    ('eagle-on-arm-0000000000'), -- 13
    ('frog_pfp____-0000000000'), -- 14
    ('frog-peeks__-0000000000'), -- 15
    ('parrot_pfp__-0000000000'), -- 16
    ('parrot-flies-0000000000'), -- 17
    ('sm_dog_pfp__-0000000000'), -- 18
    ('sm-dog-baby_-0000000000'), -- 19
    ('sm-dog-big__-0000000000'), -- 20
    ('snail_pfp___-0000000000'), -- 21
    ('snail-frog__-0000000000'), -- 22
    ('snail-travel-0000000000'), -- 23
    ('wet_acc_pfp_-0000000000'); -- 24

-- sample accounts (4)
INSERT INTO user_account 
    (account_name, email, password, display_name, profile_picture_id, bio, likes_visible, followed_visible) 
VALUES
    ('dogfan', 'dogs@gmail.com', 'ILoveDogs1234', 'Dog Fan', 10, 'A big fan dogs!', TRUE, TRUE), -- 1
    ('cats123', 'cats@gmail.com', 'MyCatIsNamedPloff', 'cat enjoyer', 5, '🐱🐱🐱🐱🐱🐱🐱', FALSE, TRUE), -- 2
    ('birder', 'birds@gmail.com', 'secure-password', 'Lover of birds', 4, 'Eagle and parrot owner! All birds welcome 😁😁😁', TRUE, TRUE), -- 3
    ('moisturizer', 'wets@gmail.com', 'i2#UL8Fx9#u&r7', 'MoistPets', 24, 'wetss only!! dries beware', FALSE, FALSE); -- 4

-- sample pets (7)
INSERT INTO pet
    (name, sex, profile_picture_id, type_id)
VALUES
    ('Lemmy', 'm', 18, 1), -- 1
    ('Mel', 'f', 1, 1), -- 2
    ('ploff', 'm', 6, 2), -- 3
    ('🦜Jerry🦜', 'm', 16, 3), -- 4
    ('🦅Joanne🦅', 'f', 11, 4), -- 5
    ('hopper', 'f', 14, 6), -- 6
    ('SLITHER', 'na', 21, 5); -- 7

-- main posts (10)
INSERT INTO blog_post (poster_id, contents)
VALUES
    (1, 'Oh how fast they grow!'), -- 1
    (1, 'Mel on the hunt.'), -- 2
    (1, 'All our babies 😊'), -- 3
    (2, 'the tiny one'), -- 4
    (2, 'look at him just standing there. not a thought in his mind...'), -- 5
    (3, 'The majestic parrot flies across the sky!'), -- 6
    (3, 'Even big birds can be friends 😁😁😁'), -- 7
    (4, 'looking at you 👁️👁️'), -- 8
    (4, 'im not slow... youre just too fast! :(('), -- 9
    (4, 'tag team get em!!'); -- 10

-- replies (6)
INSERT INTO blog_post (poster_id, reply_to, contents)
VALUES
    (2, 1, 'so hard to imagine them being this small now'), -- 11
    (1, 5, 'Hey! Don''t be mean to him!'), -- 12
    (2, 12, 'tell me you i''m wrong 😒'), -- 13
    (3, 9, 'Even our big birds have their slow days!'), -- 14
    (3, 8, 'What beautiful eyes 😍😍😍'), -- 15
    (3, 10, 'The power of cooperation 🤝🤝🤝'); -- 16

-- pet ownership
INSERT INTO pet_own (owner_id, pet_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 1),
    (2, 2),
    (2, 3),
    (3, 4),
    (3, 5),
    (4, 6),
    (4, 7);

-- attached pets
INSERT INTO blog_post_pet (post_id, pet_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 1),
    (3, 2),
    (3, 3),
    (4, 3),
    (5, 3),
    (6, 4),
    (7, 5),
    (8, 6),
    (9, 7),
    (10, 6),
    (10, 7);

-- attached images
INSERT INTO blog_post_picture (post_id, picture_id)
VALUES
    (1, 19),
    (1, 20),
    (2, 3),
    (3, 7),
    (3, 2),
    (4, 8),
    (5, 9),
    (6, 17),
    (7, 13),
    (7, 12),
    (8, 15),
    (9, 23),
    (10, 22);

-- attached tags
INSERT INTO blog_tagged (post_id, tag_id)
VALUES
    (1, 1),
    (2, 8),
    (3, 1),
    (3, 3),
    (3, 4),
    (3, 5),
    (6, 6),
    (6, 7),
    (7, 6),
    (7, 7),
    (8, 8),
    (9, 8),
    (10, 2),
    (10, 4);

INSERT INTO pet_follow (follower_id, pet_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 1),
    (2, 2),
    (2, 7),
    (3, 6),
    (3, 7),
    (4, 4),
    (4, 3),
    (4, 2);

INSERT INTO account_follow (follower_id, followed_id)
VALUES
    (1, 2),
    (2, 1),
    (2, 4),
    (3, 1),
    (3, 2),
    (3, 4);

INSERT INTO post_like (user_account_id, post_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 9),
    (2, 10),
    (3, 8),
    (3, 9),
    (3, 10),
    (4, 2),
    (4, 3),
    (4, 5),
    (4, 6),
    (4, 7);