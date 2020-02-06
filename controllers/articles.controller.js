const {
  fetchArticles,
  fetchArticle,
  updateArticleVotes,
  addArticle,
  removeArticle
} = require('../models/articles.model');
const {
  fetchCommentsByArticle,
  addCommentByArticle
} = require('../models/comments.model');

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;

  fetchArticles(sort_by, order, author, topic, limit, p)
    .then(([articles, total_count]) => {
      res.send({ total_count, articles });
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  //fetching article with comment count
  fetchArticle(article_id)
    .then(([article]) => {
      res.send({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticleVotes(article_id, inc_votes)
    .then(article => {
      if (article === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else if (inc_votes === undefined) {
        return Promise.reject({ status: 400, msg: 'Bad request' });
      } else {
        res.status(200).send({ article });
      }
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
  const { sort_by, order, limit, p } = req.query;
  //fetching comments by article, if there are no comments, checking if article exists. if it doesnt, send 404, else send the empty comments array
  fetchCommentsByArticle(article_id, sort_by, order, limit, p)
    .then(([comments, total_count]) => {
      if (comments.length === 0) {
        return Promise.all([comments, fetchArticle(article_id)]);
      } else {
        res.send({ total_count, comments });
      }
    })
    .then(([comments, article]) => {
      if (article === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else {
        res.send({ comments });
      }
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { username, title, topic, body } = req.body;

  addArticle(username, title, topic, body)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticle(article_id)
    .then(() => {
      return removeArticle(article_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
