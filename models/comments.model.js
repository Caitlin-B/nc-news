const connection = require('../db/connection');

exports.fetchCommentsByArticle = (
  article_id,
  sort_by = 'created_at',
  order = 'desc'
) => {
  //get all comments by article
  return connection
    .select('*')
    .from('comments')
    .where('article_id', article_id)
    .orderBy(sort_by, order);
};

exports.addCommentByArticle = (article_id, username, body) => {
  return connection('comments')
    .insert({ author: username, article_id: article_id, body: body })
    .returning('*')
    .then(comment => comment[0]);
};

exports.amendCommentVotes = (comment_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
  return connection('comments')
    .where('comment_id', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(comment => comment[0]);
};

exports.removeComment = comment_id => {
  return connection('comments')
    .where('comment_id', comment_id)
    .del();
};
