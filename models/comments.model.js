const connection = require('../db/connection');

exports.fetchCommentsByArticle = article_id => {
  //get all comments by article
  return connection
    .select('*')
    .from('comments')
    .where('article_id', article_id);
};
