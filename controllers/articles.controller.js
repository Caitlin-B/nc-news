const {
  fetchArticles,
  fetchArticle,
  updateArticleVotes
} = require('../models/articles.model');
const {
  fetchCommentsByArticle,
  addCommentByArticle
} = require('../models/comments.model');

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  fetchArticles(sort_by, order, author, topic)
    .then(articles => {
      return Promise.all(
        articles.map(article => {
          return fetchArticle(article.article_id);
        })
      );
    })
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else {
        res.send({ articles });
      }
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
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
  const { article_id } = req.params;
  const { username, body } = req.body;

  addCommentByArticle(article_id, username, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  //fetching comments by article, if there are no comments, checking if article exists. if it doesnt, fetch article function will reject
  fetchCommentsByArticle(article_id, sort_by, order)
    .then(comments => {
      if (comments.length === 0) {
        return Promise.all([comments, fetchArticle(article_id)]);
      } else {
        res.send({ comments });
      }
    })
    .then(([comments, article]) => {
      res.send({ comments });
    })
    .catch(next);
};
