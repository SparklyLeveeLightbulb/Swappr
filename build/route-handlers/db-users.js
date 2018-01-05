const express = require('express');
const Sequelize = require('sequelize');
const db = require('../../app/db');

const app = express();

const Op = Sequelize.Op;

let id;

app.use(express.json());

app.get('/users/single', (req, res) => {
  const { id } = req.headers;
  db.User.findOne({ where: { id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

app.get('/users', (req, res) => {
  const { id, items } = req.headers;
  const itemArray = items.split(',');
  db.Transaction.findAll({
    where: {
      [Op.or]:
      [
        { id_user: id },
        {
          id_item_desired: {
            [Op.in]: itemArray,
          },
        },
      ],
      accepted: true,
    },
    include: [{
      model: db.Item,
      as: 'desired',
    },
    {
      model: db.Item,
      as: 'offered',
    }],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

app.post('/users', (req, res) => {
  // ! Verification will probably need to happen in here!
  const { name, email, id_facebook } = req.body;

  return db.User.findCreateFind({
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

app.post('/giveEmail', (req, res) => {
  id = req.body.email;
  res.send(302);
});

app.get('/email', (req, res) => {
  console.log('i got hit ', id);
  res.send({ id });
});

app.get('/getEmail', (req, res) => {
  console.log(req.query.id);
  const foundId = req.query.id;
  db.User.find({
    where: {
      id: foundId,
    },
  })
    .then((user) => {
      res.send(user.email);
    })
    .catch((err) => {
      console.log('this is /getEmail GET err ', err);
      res.sendStatus(500);
    });
});
// app.get('/reviews', (req, res) => {
//   console.log('this is req.data from /reviews GET ', req.data);
//   console.log('this is res.body from /reviews GET ', res.body);
//   db.Review.findAll({
//     where: {
//       reviewee: req.data.id,
//     },
//   }).then((comment) => {
//     res.send(comment);
//   });
// });

// app.post('/reviews', (req, res) => {
//   console.log('I am res.body from /reviews POST ', res.body);
//   console.log('I am req.body from /reviews POST', req.body);
//   db.Review.create({
//     comment: req.body.review,
//     rating: req.body.rating,
//     reviewee: req.body.reviewee,
//     reviewer: req.body.reviewer,
//   }).then(review =>
//       res.send(review))
//     .catch((err) => {
//       console.log('this is /reviews POST err ', err);
//       res.sendStatus(500);
//     });
// });

module.exports = app;
