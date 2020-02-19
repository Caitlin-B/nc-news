const connection = require('../db/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config');

exports.sendToken = (req, res, next) => {
  const { username, password } = req.body;

  return connection
    .select('*')
    .from('users')
    .where('username', username)
    .then(([user]) => {
      if (!user || password !== user.password) {
        next({ status: 401, msg: 'invalid username or password' });
      } else {
        const token = jwt.sign(
          { user: user.username, iat: Date.now() },
          JWT_SECRET
        );
        res.send({ token });
      }
    });
};

exports.validateToken = (req, res, next) => {
  // Header in the format 'BEARER <token>' split to extract the token
  const { authorization } = req.headers;
  if (!authorization) {
    next({ status: 401, msg: 'unauthorised' });
  } else {
    const token = authorization.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) next({ status: 401, msg: 'unauthorised' });
      else next();
    });
  }
};
