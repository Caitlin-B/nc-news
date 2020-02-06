const articlesRouter = require('express').Router();
const {
  getArticle,
  patchArticleVotes,
  postArticleComments,
  getCommentsByArticle,
  getAllArticles,
  postArticle
} = require('../controllers/articles.controller');

articlesRouter
  .route('/')
  .get(getAllArticles)
  .post(postArticle);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticleVotes);

articlesRouter
  .route('/:article_id/comments')
  .post(postArticleComments)
  .get(getCommentsByArticle);

module.exports = articlesRouter;
