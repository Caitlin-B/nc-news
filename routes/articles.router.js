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

articlesRouter
  .route('/')
  .get(getAllArticles)
  .post(postArticle);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticleVotes)
  .delete(deleteArticle);

articlesRouter
  .route('/:article_id/comments')
  .post(postArticleComments)
  .get(getCommentsByArticle);

module.exports = articlesRouter;
