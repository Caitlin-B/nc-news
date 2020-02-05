exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleError22P02 = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else next(err);
};

exports.handleError23502 = (err, req, res, next) => {
  if (err.code === '23502') {
    res.status(400).send({ msg: 'Bad request' });
  } else next(err);
};

exports.handleError42703 = (err, req, res, next) => {
  if (err.code === '42703') {
    res.status(400).send({ msg: 'Queried column does not exist' });
  } else next(err);
};

exports.handleError23503 = (err, req, res, next) => {
  if (err.code === '23503') {
    res.status(404).send({ msg: 'Not found' });
  } else next(err);
};
