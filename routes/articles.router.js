const articlesRouter = require('express').Router();
const {
  getArticle,
  patchArticleVotes,
  postArticleComments,
  getCommentsByArticle,
  getAllArticles
} = require('../controllers/articles.controller');

articlesRouter.route('/').get(getAllArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticleVotes);

articlesRouter
  .route('/:article_id/comments')
  .post(postArticleComments)
  .get(getCommentsByArticle);

module.exports = articlesRouter;
