const express = require('express');
const Sequelize = require('sequelize');
const db = require('../../app/db');
const axios = require('axios');
// const cloud = require('./cloud-variables');

const app = express();
const Op = Sequelize.Op;

app.use(express.json());

app.post('/cloud', (req, res) => {
  console.log(req.body.img, 'this is img');
  console.log(req.body.preset, 'this is preset');
  const params = {
    file: req.body.img,
  };
  console.log(params, 'this is params');
  axios.post(`https://api.cloudinary.com/v1_1/demo/image/upload`, params)
  .then((result) => { console.log(result, 'this is result from post to cloudinary'); })
  .catch((error) => { console.error(error, 'this is error from post to cloudinary'); });
});

app.get('/items', (req, res) => {
  const { id_user } = req.headers;
  db.Item.findAll({ where: { id_user } })
    .then(items =>
      res.send(items))
    .catch((err) => {
      console.error(err);
      res.send(500);
    });
});

app.post('/items', (req, res) => {
  const newItem = req.body;
  if (newItem.id_category === undefined) {
    newItem.id_category = 15;
  }
  db.Item.create(newItem)
    .then(createdItem =>
      res.send(createdItem))
    .catch((err) => {
      console.error(err);
      res.send(500, 'something went wrong!');
    });
});

app.delete('/items', (req, res) => {
  const { id_item: id } = req.headers;
  db.Transaction.destroy({
    where: {
      [Op.or]: [{ id_item_desired: id }, { id_item_offered: id }],
    },
  })
  .then(() => {
    db.Item.destroy({ where: { id } })
      .then(() => {
        res.send('Item deleted successfully!');
      })
      .catch((err) => {
        console.error(err);
        res.send(500, 'something went wrong!');
      });
  })
  .catch((err) => {
    console.error(err);
    res.send(500, 'something went wrong!');
  });
});

module.exports = app;
