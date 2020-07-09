const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../models');

// POST is authorised
router.post('/register', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (!login || !password || !passwordConfirm) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');
    if (!passwordConfirm) fields.push('passwordConfirm');

    res.json({
      ok: false,
      error: 'Write all data!',
      fields,
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Must be only english letters!',
      fields: ['login'],
    });
  } else if (login.length < 3 || login.length > 16) {
    res.json({
      ok: false,
      error: 'Length must be bigger then 3 and smaller then 16',
      fields: ['login'],
    });
  } else if (password !== passwordConfirm) {
    res.json({
      ok: false,
      error: 'Passwords do not match',
    });
  } else if (password.length < 5) {
    res.json({
      ok: false,
      error: 'Length must be bigger then 5',
      fields: ['password'],
    });
  } else {
    models.User.findOne({
      login,
    }).then((user) => {
      if (!user) {
        bcrypt.hash(password, null, null, (err, hash) => {
          models.User.create({
            login,
            password: hash,
          })
            .then((user) => {
              console.log(user);
              res.json({
                ok: true,
              });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                ok: false,
                error: 'Error',
              });
            });
        });
      } else {
        res.json({
          ok: false,
          error: 'Name is busy',
          fields: ['login'],
        });
      }
    });
  }
});

module.exports = router;
