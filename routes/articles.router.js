const articlesRouter = require('express').Router();
const {
  getArticle,
  patchArticleVotes,
  postArticleComments,
  getCommentsByArticle,
  getAllArticles,
  postArticle,
  deleteArticle
} = require('../controllers/articles.controller');
const { validateToken } = require('../controllers/auth.controller');

articlesRouter.route('/').get(getAllArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticleVotes)
  .delete(deleteArticle);

articlesRouter.route('/:article_id/comments').get(getCommentsByArticle);

//need login and password to access all routes below

articlesRouter.route('/').post(validateToken, postArticle);

articlesRouter
  .route('/:article_id/comments')
  .post(validateToken, postArticleComments);

module.exports = articlesRouter;
