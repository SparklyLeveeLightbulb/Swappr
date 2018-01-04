const express = require('express');
const Sequelize = require('sequelize');
const db = require('../../app/db');

const app = express();

const Op = Sequelize.Op;

app.use(express.json());

app.post('/reviews', (req, res) => {
  
  const { email } = req.body;

  return db.Review.findCreateFind({
    where: {
      email,
      id_facebook,
    },
  })
    .spread((userResult, created) => {
      if (created) {
        userResult.update({ name })
          .then((updatedUser) => {
            res.send(updatedUser);
          });
      } else if (userResult === null) {
        res.send(406, 'could not find or create');
      } else {
        res.send(userResult);
      }
    })
    .catch((err) => {
      console.error(err);
      res.send(500, err);
    });
});

