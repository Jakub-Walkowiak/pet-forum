# pet-forum

A (very creatively named!) social media platform designed (shockingly!) with pets in mind built using Next.JS, express.js, PostgreSQL and TypeScript.

## Features

### The basics

This application was built first of all as a fully funtional social media platform, including features such as:

- Account system, including
    - profile customization
    - following other users
    - account stats
- Blog posts
    - designed with relatively short-form in mind (300 characters)
    - featuring text and images
    - featuring a like system
    - and replies, which are themselves fully-featured blog-posts
- Feeds
    - your main two feeds: discover and followed
    - searching, including advanced search (UI support limited)

### It's a pet forum!

On top of those, the app has alsp been featured with additions tailored to pet-posting in mind:

- Pets!
    - each pets has its profile, much like a user
    - can be followed individually, without following its owner
    - even more stats!
- Pet ownership system
    - when you add your pet, you are its owner
    - as owner, you can add other owners
    - you can rescind your own ownership if pet is co-owned
- Tag system
    - blog posts can be tagged
    - create your own tags or add existing ones
- Pet linking system
    - owners can 'feature' their pets in blog posts
    - posts featured in show up in pet profiles
    - they also show on your followed feed (if you follow the pet of course!)
    - multiple pets can be featured
- Pet categorization
    - readily available (and searchable) info about pets
    - pets store info about their species
    - and about their sex (potenitally extensible to less common sexes as well)

## Running

The application is split into a front- and back-end, both of which need to be run separately.

### Front-end

#### Requirements

- node (built on v21.7.2)
- npm (built with 10.5.0)

#### Running

Starting from the repo root directory, run

```sh
cd back-end
npm i
# compiled
npm run build
npm run start
# or dev
npm run dev
```

The app should run on localhost:8080 by default

### Back-end

#### Requirements

- node (built on v21.7.2)
- npm (built with 10.5.0)
- a running PostgreSQL server (built with 16.3)
- a .env file in the back-end directory (detailed below)

#### Database setup

Database structure and queries to recreate it (in an existing psql database) can be found in /back-end/db_schema.sql
Additionally, you can run fixtures.sql on your database to fill it with some starting data

> [!IMPORTANT]
> While the fixture db contains file *paths* for images, you will still need to copy the *actual* images from imgs-fixtures into the images directory set in .env. I would *not* recommend using imgs-fixtures as that directory, as it is also used during testing, and changing its structure could potentially affect testing. Additionally, /back-end/testing.png is not registered in the databse and is only relevant for tests.

#### .env

In order for the application to correctly run, you will need to create a .env file in the back-end directory, with the following structure:

```
DB_HOST="localhost" // hostname your database is running from
DB_PORT=5432 // port your database is running from
DB_USER="" // account name for priviledged user of database
DB_PASS="" // password for said user
DB_NAME="pet_forum" // name of the database

IMGS_DIR="imgs" // directory name (without /) where uploaded imgs will be stored 
                // relative to back-end directory 
                // (e.g currently they would go into /back-end/imgs)

PORT=3000 // port to listen on

JWT_SECRET="" // a secret used for jwt token signing
```

> [!WARNING]
> It is not recommended to change the port from 3000, as the frontend, in its current state, has been hardcoded to make requests to http://localhost:3000. Change at your own discretion!

#### Running

Starting from the repo root directory, run

```sh
cd back-end
npm i
npm run dev
```

## Testing

> [!NOTE]
> Due to time/'workforce' limitations (I made this alone!) as well as due to the project's fairly large size, only a limited amount of tests has been implemented, and a they may not fully be up to quality standards due to burnout.

### Front-end

Testing the front-end should not require any additional setup, simply (starting at the repo root directory), run

```sh
cd front-end
npm run test
```

### Back-end

#### Database and images

Running tests on the back-end will require a real PostgreSQL database connection, however the program will try to use a different database than the one that's already been configured in .env. On top of that, tests will also use a different images directory. Both of these things will need to be added to your .env file as such:

```
DB_NAME_TEST="pet_forum_test"
IMGS_DIR_TEST="imgs-test"
```

The other db parameters will be the same as the ones used for the regular connection, so put the testing db on the same server.

> [!CAUTION]
> Running test will automatically and without warning clear the testing img directory and the testing databse. Do *not* use the same database or images directory for testing and standard execution unless you do not care about preserving the data.

#### Running

To run back-end tests, simply run these commands from the root directory:

```sh
cd back-end
npm run test
```

> [!NOTE]
> Due to an issue whose cause I could not diagnose, it is possible that 2 of the tests will occasionally fail because of beforeAll setup not executing as intended. If this is the case, simply running the test again should fix the issue.

#### Windows (and other POSIX non-compliant shells)

The test command uses syntax which is not guaranteed to correctly work in POSIX non-compliant shell environments (e.g. both of Windows' built-in shells). To fix this, either use an alternative shell (e.g. run the tests using WSL) or use cross-env using the following steps:

- install cross-env in the back-end directory
```sh
cd back-end
npm i -D cross-env
```
- alter the test script in /back-end/package.json from
```json
"test": "NODE_ENV=test jest --silent",
```
- to
```json
"test": "cross-env NODE_ENV=test jest --silent",
```

> [!CAUTION]
> If you attempt to run back-end tests in a POSIX non-compliant environment without following either of the aforementioned instructions you are putting your main database at risk of being overriden. You have been warned!

## Known issues

The app should be almost entirely stable and bug-free, however there are some issues that I've decided go beyond the scope of this project, given deadlines and all.

- When attempting to link pets to a blog post, the popup will at first display a list of all pets rather than your owned ones. Click the search icon again to refresh the list and display the correct list (trying to add them anyways *should* give an error when posting).
- Rescinding ownership when you are the sole owner of a pet is prevented in the front-end UI, but is *not* prevented in the back-end API. 
- useAuth() hook is needlessly re-instantiated for every single component that uses it instead of being globally provided.
