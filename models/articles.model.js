const connection = require('../db/connection');
const { fetchCommentsByArticle } = require('./comments.model');

exports.fetchArticle = article_id => {
  //get all article by article id and get all comments by article, adding comment count to article keys. If there is no article rejecting and sending 404
  return connection
    .select('*')
    .from('articles')
    .where('article_id', article_id)
    .then(articles => articles[0])
    .then(article => {
      if (article === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else {
        return Promise.all([article, fetchCommentsByArticle(article_id)]);
      }
    })
    .then(([article, comments]) => {
      article.comment_count = comments.length;
      return article;
    });
};

//in order to get comment count, should i amend this model to do the same as the above model, or should i reuse the above model to get the article in the right format??
exports.updateArticleVotes = (article_id, newVotes) => {
  //update article votes by article id
  return connection('articles')
    .where('article_id', article_id)
    .update({ votes: newVotes })
    .returning('*')
    .then(article => article[0]);
};
