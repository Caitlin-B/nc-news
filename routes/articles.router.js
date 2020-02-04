const articlesRouter = require('express').Router();
const {
  getArticles,
  patchArticleVotes,
  postArticleComments
} = require('../controllers/articles.controller');


articlesRouter
  .route('/:article_id')
  .get(getArticles)
  .patch(patchArticleVotes);

articlesRouter
  .route('/:article_id/comments')
  .post(postArticleComments)

module.exports = articlesRouter;
