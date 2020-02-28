# NC news API

NC news is a web application which acts as a resource of news articles, allowing users to create a username, and post and vote on articles and comments under a variety of topics.

Hosted: https://cb-news.herokuapp.com/api

Front-end Github: https://github.com/Caitlin-B/fe-nc-news

Front-end hosted: https://cb-nc-news.netlify.com/

## Getting started

### Prerequisites

- Node.js v12.12.0
- PostgreSQL v11.5

### Installing

1. Clone this repository

```bash
git clone https://github.com/Caitlin-B/nc-news
```

2. `cd` into the repository

```
cd nc-news
```

3. Install the dependencies by running the following script

```
npm install
```

4. Then seed the local database

```
npm run setup-dbs
npm run seed-dev
```

5. Finally create a knexfile.js at the top level of the repo. If you are not using MacOS you will also need to include the `username` and `password` for PostgreSQL

```js
const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
      //username: 'your_username',
      //password: 'your_password'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
      //username: 'your_username',
      //password: 'your_password'
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

## Running the tests

To run the tests, run the "test" script

```
npm test
```

## Running the project locally

To run the app locally run the following script

```
npm start
```
