const connection = require('../db/connection');
const { fetchCommentsByArticle } = require('./comments.model');
const { fetchUsers } = require('./users.model');
const { fetchTopics } = require('./topics.model');

exports.fetchArticles = (
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic
) => {
  //selecting all columns from articles and adding a column count column, joining on the comments and grouping by article_id. Then ordering by queried column and where there is a topic or author selected, filtering by them.
  return connection
    .select('articles.*')
    .from('articles')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .modify(query => {
      if (topic) query.where('topic', topic);
    })
    .modify(query => {
      if (author) query.where('articles.author', author);
    })
    .then(articles => {
      //if article length is 0 check if the author exists
      // if it doesnt send 404
      //if it does send 200 and articles
      return Promise.all([articles, fetchUsers(author)]);
      // return Promise.reject({ status: 404, msg: 'Not found' });
    })
    .then(([articles]) => {
      return Promise.all([articles, fetchTopics(topic)]);
    });
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
