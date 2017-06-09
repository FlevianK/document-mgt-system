const bcrypt = require('bcrypt');
const jwt = require('json-web-token');
const secretKey = process.env.SECRET_TOKEN_KEY;
const db = require('../models');
const User = db.Users;
const Document = db.Document;

module.exports = {
  create(req, res) {
    return User
      .create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
        email: req.body.email
      })
      .then(user => res.status(200).send(user) ,{
        message: "User created!"
      })
      .catch(error => res.status(400).send(error));
  },

  loginUser(req, res) {
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then((user) => {
        if (!user) {
          return res.status(403).send({
            message: 'Invalid user',
          });
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const token = jwt.sign({ data: user.id }, secretKey, { expiresIn: '24h' });
          return res.status(200).send({
            message: 'Successfully logged in',
            token,
            expiresIn: '24h'
          });
        }
        return res.status(401).send({
          error: 'Wrong password/username combination'
        });
      })
  },
  list(req, res) {
    if (req.query.limit || req.query.offset) {
      return User.findAll({
        offset: req.query.offset,
        limit: req.query.limit
      })
        .then(user => res.status(200).send(user))
        .catch(error => res.status(400).send(error));
    }
    return User
      .findAll({
        include: [{
          model: Document,
          as: 'documents'
        }]
      })
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    return User
      .findById(req.params.userId, {
        include: [{
          model: Document,
          as: 'documents'
        }]
      })
      .then(user => {
        if (!user) {
          res.status(404).send({
            message: 'User Not Found'
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => { res.status(400).send(error) });
  },
  update(req, res) {
    return User
      .findById(req.params.userId, {
        include: [{
          model: Document,
          as: 'documents'
        }]
      })
      .then(user => {
        if (!user) {
          res.status(404).send({
            message: 'User Not Found'
          });
        }
        return user
          .update({
            username: req.body.username || user.username,
            password: req.body.password || user.password,
            email: req.body.email || user.email
          })
          .then(() => res.status(200).send(user))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  destroy(req, res) {
    return User
      .findById(req.params.userId)
      .then(user => {
        if (!user) {
          res.status(404).send({
            message: 'User Not Found'
          });
        }
        return user
          .destroy({
            username: req.body.username || user.username,
            password: req.body.password || user.password,
            email: req.body.email || user.email
          })
          .then(() => res.status(200).send({ message: 'User successfully deleted' }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  findByq(req, res) {
    return User
      .findAll({
        where: {
          $or: [
            { username: { $like: `%${req.query.q}%` } },
            { email: { $like: `%${req.query.q}%` } }
          ]
        }
      })
      .then(response => res.status(200).send(response))
      .catch(error => res.status(400).send(error));
  },
}
