'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var client = require('../db/index');


module.exports = router;

// client.query("SELECT * FROM tweets", function(err, data){
//   if (err) return err;
//   data.rows.forEach(row=>console.log(row))
// })


// a reusable function
function respondWithAllTweets (req, res, next){
  var showtweets = [];
  client.query(
    "SELECT users.name as name, tweets.content as content, users.picture_url as pic, tweets.id as id FROM tweets INNER JOIN users on tweets.user_id = users.id",
    function(err, data){
      if (err) return err;
      data.rows.forEach(row=>showtweets.push(row));
      res.render('index', {
        title: 'Twitter.js',
        tweets: showtweets,
        showForm: true
      });
    }
  )
}

// here we basically treet the root view and tweets view as identical
router.get('/', respondWithAllTweets);
router.get('/tweets', respondWithAllTweets);

// single-user page
router.get('/users/:username', function(req, res, next){
  var showtweets = [];
  var tweetsForName = req.params.username;
  client.query(
    "SELECT users.name as name, tweets.content as content, users.picture_url as pic, tweets.id as id FROM tweets INNER JOIN users on tweets.user_id = users.id WHERE name = $1",
    [tweetsForName], function(err, data){
      if (err) return err;
      data.rows.forEach(row=>showtweets.push(row));
      res.render('index', {
        title: 'Twitter.js',
        tweets: showtweets,
        showForm: true,
        username: req.params.username
      });
    }
  )
});


// single-tweet page
router.get('/tweets/:id', function(req, res, next){
  var showtweets = [];
  var tweetsWithThatId = Number(req.params.id);
  client.query(
    "SELECT users.name as name, tweets.content as content, users.picture_url as pic, tweets.id as id FROM tweets INNER JOIN users on tweets.user_id = users.id WHERE tweets.id = $1",
    [tweetsWithThatId], function(err, data){
      if (err) return err;
      data.rows.forEach(row=>showtweets.push(row));
      res.render('index', {
        title: 'Twitter.js',
        tweets: showtweets // an array of only one element ;-)
      });
    }
  )
});

// create a new tweet
router.post('/tweets', function(req, res, next){
  var showtweets = [];
  // var newTweet = tweetBank.add(req.body.name, req.body.content);
  var user_id;
  // insertuser('10')
  client.query(
    "SELECT users.id as id FROM users WHERE users.name = $1", [req.body.name],
    function(err, data){
      if (err) return err;
      // console.log(data);
      if(data.rowCount === 0){
        console.log("======got into the function")
        insertuser(req.body.name);
      }
      inserttweet(req.body.name,req.body.content);

      data.rows.forEach(row=>showtweets.push(row));
    });
    client.query("SELECT * FROM tweets", function(err,data){data.rows.forEach(row=>console.log(row));})
  res.redirect('/');
});

function insertuser(user_id){
  console.log(user_id)
  client.query(
    "INSERT INTO users (name, picture_url) VALUES ($1, $2)",[user_id, "https://pbs.twimg.com/profile_images/2450268678/olxp11gnt09no2y2wpsh_normal.jpeg"], function(err, data){
    }
  );
}

function inserttweet(name, body_content){
  var user;
  console.log(name);
  client.query("SELECT id FROM users WHERE name = $1",['' + name],function(err,data){
    // user = data.rows[0];
    console.log("=====hi")
    console.log(user);
  })
  console.log(user);
  client.query(
    "INSERT INTO tweets (user_id, content) VALUES ($1, $2)",[user, body_content], function(err, data){
    }
  );
}


// // replaced this hard-coded route with general static routing in app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });
