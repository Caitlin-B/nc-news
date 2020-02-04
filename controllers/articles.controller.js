const {
  fetchArticle,
  updateArticleVotes
} = require('../models/articles.model');
const { fetchCommentsByArticle } = require('../models/comments.model');

exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  //fetching article with comment count
  fetchArticle(article_id)
    .then(article => {
      res.send({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  //getting article votes and then incrementing by inc_votes key on passed body, then updating the article votes to reflect new value
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  const parsedIncVotes = parseInt(inc_votes);

  fetchArticle(article_id)
    .then(({ votes }) => {
      const newVotes = votes + parsedIncVotes;
      return updateArticleVotes(article_id, newVotes);
    })
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticleComments = (req, res, next) => {
  
};
