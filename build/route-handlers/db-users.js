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
        { id_item_desired: {
          [Op.in]: itemArray,
        } },
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


const dummyData = {
  id: 1,
  email: "cings0@comcast.net",
  reviews: [
    {
      rating: 1,
      review: "There was no laptop in the box. It was just a bunch of rocks!!",
      reviewee: 81,
      reviewer: 78
    },
    {
      rating: 3,
      review: "It was not what was pictured but it still worked.",
      reviewee: 45,
      reviewer: 33
    },
    {
      rating: 2,
      review: "He is rude",
      reviewee: 89,
      reviewer: 53
    },
    {
      rating: 5,
      review: "The cookie he swapped me was a tasty",
      reviewee: 93,
      reviewer: 86
    },
    {
      rating: 4,
      review: "The playstation was in pretty good condition",
      reviewee: 4,
      reviewer: 11
    }
  ]
};

app.get('/email', (req, res) => {
  console.log('i got hit', id);
  res.send({ id });
});
app.get('/getEmail/:id', (req, res) => {
  db.User.findOne({
    where: {
      id: id,
    },
  }).then(email => res.send(email.email))
  .catch(err => console.error(err));
  
});

app.post('/email', (req, res) => {
  res.send('cool');
});

app.get('/reviews', (req, res) => {
  res.send(dummyData);
});
app.post('/reviews', (req, res) => {
  dummyData.reviews.push(req.body);
  res.send(dummyData);
});

module.exports = app;
