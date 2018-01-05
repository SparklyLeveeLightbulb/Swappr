const express = require('express');
// const Sequelize = require('sequelize');
const db = require('../../app/db');
const axios = require('axios');

const app = express();

const Op = Sequelize.Op;

app.use(express.json());

sending GET /reviews - sending ID -
query DB(reviews) for reviews associated with person being reviewed(ID)

app.post('/reviews', (req, res) => {
  console.log('Hitting the /reviews endpoint ');

  const { id } = req.headers;
  db.Review.findAll({
    where: {
      reviewee: id,
    },
  })
    .then(reviews =>
      res.send(reviews))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  res.send('HELLO');
});

// app.post('/reviews', (req, res) => {
//   console.log('I am hit from a POST');
//   const {} = req.body;
// })
/*
{
  reviewer: int,
  reviewee: int,
  rating: 1 - 5,
  review: 'a great experience',
}
*/
