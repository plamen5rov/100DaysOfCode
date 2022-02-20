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

  res.render('posts-list', { posts: posts });
});

router.get('/new-post', async function (req, res) {
  const authors = await db.getDb().collection('authors').find().toArray();

  res.render('create-post', { authors: authors });
});

router.get('/posts/:id', async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection('posts')
    .findOne({ _id: new ObjectId(postId) }, { summary: 0 });

  if (!post) {
    return res.status(404).render('404');
  }
  post.humanReadableDate = post.date.toLocaleDateString('bg-BG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  post.date = post.date.toISOString();

  res.render('post-detail', { post: post });
});


router.get('/posts/:id/edit', async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection('posts')
    .findOne({ _id: new ObjectId(postId) }, { title: 1, summary: 1, body: 1 });

  if (!post) {
    return res.status(404).render('404');
  }

  res.render('update-post', { post: post });
});



router.post('/posts/', async function (req, res) {

  const authorID = new ObjectId(req.body.author);
  const author = await db
  .getDb()
  .collection('authors')
  .findOne({ _id: authorID });

  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
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



router.post('/posts/:id/edit', async function (req, res) {
  const postId = new ObjectId(req.params.id);
  const result = await db
    .getDb()
    .collection('posts')
    .updateOne({ _id: postId }, {
      $set: {
        title: req.body.title,
        summary: req.body.summary,
        body: req.body.content,
      }
    });

  res.redirect('/posts');

});


module.exports = router;