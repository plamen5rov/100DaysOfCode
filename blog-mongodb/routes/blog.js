const express = require('express');
const mongodb = require('mongodb');
const db = require('../data/database');
const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/posts');
});

router.get('/posts', async function (req, res) {

  const posts = await db.getDb()
  .collection('posts')
  .find({}, { title: 1, summary: 1, 'author.name': 1 })
  .toArray();

  res.render('posts-list', {posts: posts});
});

router.get('/new-post', async function (req, res) {
  const authors = await db.getDb().collection('authors').find().toArray();

  res.render('create-post', { authors: authors });
});

router.post('/posts', async function (req, res) {

  const authorID = new ObjectId(req.body.author);
  const author = await db.getDb().collection('authors').findOne({ _id: authorID });

  const newPost = {
    title: req.body.title,
    summary: req.body,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorID,
      name: author.name,
      email: author.email
    }
  };
  const result = await db.getDb().collection('posts').insertOne(newPost);

  res.redirect('/posts');

});

module.exports = router;