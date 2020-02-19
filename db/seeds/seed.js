const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');
//seeding our data into the database using knex, rather than inputting it manually
exports.seed = function(knex) {
  const topicsInsertions = knex('topics')
    .insert(topicData)
    .returning('*');
  const usersInsertions = knex('users')
    .insert(userData)
    .returning('*');

  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest()) //ensure running the latest migration with every seed
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions]);
    }) //inserting topics and users
    .then((topics, users) => {
      const formattedArticles = formatDates(articleData);
      return knex('articles')
        .insert(formattedArticles)
        .returning('*');
      /* 
      Article date is reformatted to be sql complatable, inserted into the data table and returned to be used for formatting comment data.
      */
    })
    .then(articleRows => {
      /* 
      Make a reference obj from article rows to get name and id key value pair

      reformat comments to have correct date format

      reformat comments to have author and article_id keys

      */
      const articleRef = makeRefObj(articleRows);
      const dateFormattedComments = formatDates(commentData);
      const formattedComments = formatComments(
        dateFormattedComments,
        articleRef
      );
      return knex('comments').insert(formattedComments);
    });
};
