const connection = require('../db/connection');
const { fetchUsers } = require('./users.model');
const { fetchTopics } = require('./topics.model');

exports.fetchArticles = (
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic,
  limit = 10,
  p = 1
) => {
  //selecting all columns from articles and adding a column count column, joining on the comments and grouping by article_id. Then ordering by queried column and where there is a topic or author selected, filtering by them.
  return connection
    .select('articles.*')
    .from('articles')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .limit(Number(limit))
    .offset(limit * p - limit)
    .modify(query => {
      if (topic) query.where('topic', topic);
      if (author) query.where('articles.author', author);
    })
    .then(articles => {
      //if article length is 0 check if the author exists
      // if it doesnt send 404
      //if it does send 200 and articles
      return Promise.all([articles, fetchUsers(author)]);
    })
    .then(([articles]) => {
      return Promise.all([articles, fetchTopics(topic)]);
    })
    .then(([articles]) => {
      //returning limit number of articles and a count of total articles
      return Promise.all([articles, exports.fetchArticleCount(author, topic)]);
    });
};

exports.fetchArticleCount = (author, topic) => {
  //returning a count of all queried articles
  return connection
    .select('*')
    .from('articles')
    .modify(query => {
      if (topic) query.where('topic', topic);
      if (author) query.where('articles.author', author);
    })
    .then(articles => articles.length);
};

exports.fetchArticle = article_id => {
  //getting articles and join on comments, then grouping by article and adding a comment_count column, filtering by article id

  return connection
    .select('articles.*')
    .from('articles')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', article_id)
    .then(articles => articles[0]);
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  //update article votes by article id
  return connection('articles')
    .where('article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(article => article[0]);
};
