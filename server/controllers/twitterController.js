require('dotenv').config();
const request = require('request');

const credentials = `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`;
const credentialsBase64Encoded  = new Buffer(credentials).toString('base64');

//Retrieves access token from twitter
const getToken = (cb) => { 
  const options = {
    url: 'https://api.twitter.com/oauth2/token',
    method:'POST',
    headers: {
      'Authorization': `Basic ${credentialsBase64Encoded}`,
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials'
  }
  request(options, cb);
}

//Retrieves tweets after obtaining hashtags or tokens
//Change count in the parameters to change the default # of tweets returned (max 200)
const getTweets = (hashtag, token, cb, count = 30) => {
  if (hashtag.length > 1) {
    hashtag = hashtag.join('+OR+%23');
  }
  let query = '%23' + hashtag;
  const options = {
    url: `https://api.twitter.com/1.1/search/tweets.json?q=${query}&count=${count}`,
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
    }
  }
  request(options, cb);
}

module.exports = {
  //Chains together the above functions to retrieve tweets
  getTweetsForHashtag: (req, res) => {
    const { hashtag } = req.body;
    let token;
    getToken((err, result ) => {
      if (err) {
        console.log('error with getToken', err);
        return;
      } else {
        token = JSON.parse(result.body);
        console.log('token is... ', token);
        getTweets(hashtag, token, (error, tweets) => {
          if (error) {
            console.log('error with getTweets', error);
            return;
          }
          res.send(JSON.parse(tweets.body));
        })
      }
    })
  }
 }