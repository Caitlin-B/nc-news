const {
  amendCommentVotes,
  removeComment
} = require('../models/comments.model');

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  const parsedIncVotes = parseInt(inc_votes);

  amendCommentVotes(comment_id, parsedIncVotes)
    .then(comment => {
      res.send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(rows => {
      if (rows === 0) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else if (rows === 1) {
        res.status(204).send();
      }
    })
    .catch(next);
};
