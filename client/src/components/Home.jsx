import React, { Component } from 'react';
import Button from './Button.jsx'
import axios from 'axios';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hashtag: '',
      tweets: [],
      numberOfTweets: 15
    }
    this.fetchTweets = this.fetchTweets.bind(this);
    this.grabHashtag = this.grabHashtag.bind(this);
    this.grabNumber = this.grabNumber.bind(this);
    this.sortCriteria = this.sortCriteria.bind(this);
  }
  
  //gets the tweets for an associated hashtag
  async fetchTweets() {
    try {
      let { hashtag } = this.state;
      const { count } = this.state;
      hashtag = hashtag.replace(/\s/g, '').split('#');
      hashtag.shift();
      const tweets = await axios.post(`http://localhost:3000/twitter/getTweetsForHashtag`, { hashtag, count })
      const { data } = tweets;
      await this.setState({
        tweets: data.statuses,
        hashtag: '',
      })
    } catch (error) {
      console.log('Error with fetchTweets', error);
      return;
    }
  }

  //grabs the text from the input 
  grabHashtag(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  //grabs the number of results
  grabNumber(e) {
    this.setState({
      numberOfTweets: e.target.value
    })
  }

  //sorts tweets according to the criteria entered as an argument
  sortCriteria(criteria) {
    const sorted = this.state.tweets.sort((a, b) => {
      return b[criteria] - a[criteria];
    })
    this.setState({
      tweets: sorted
    })
  }
  

  render() {
    return (
      <div>
        <h2 id="input">
          Please enter twitter hashtag(s) here: 
          <br/>
          <br/>
          <input 
          type="text" 
          name="hashtag" 
          value={this.state.hashtag}
          onChange={this.grabHashtag}
          placeholder="#apples #bananas #fruit"
          />
          <button className="submit" onClick={this.fetchTweets}> 
            Submit 
          </button>
          <br/>
          Filter results: 
          <select onChange={this.grabNumber} value={this.state.numberOfTweets}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15" selected="selected">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
          </select>
        </h2>
        <h2> Sort by: 
          <br/>
          <br/>
          <Button value={'favorite_count'} name={'Favorite count'} press={this.sortCriteria}/>
          <Button value={'retweet_count'} name={'Retweet count'} press={this.sortCriteria}/>
          <Button value={'created_at'} name={'Time created'} press={this.sortCriteria}/>
        </h2>
        <div className="tweet-container">
          {this.state.tweets.length > 0 ? this.state.tweets.map((tweet, i) => {
            return (
              <div key={i}> 
                <div className="tweet-box">
                  <img src={tweet.user.profile_image_url}/> 
                  <a href={tweet.user.url} target="_blank"> @{tweet.user.screen_name} </a>  : {tweet.text} tweeted at {tweet.created_at}
                  <i className="far fa-heart"></i> {tweet.favorite_count}
                  <i className="fas fa-retweet"></i> {tweet.retweet_count} 
                </div>
              </div> 
            )
          }) : null
          }
        </div>
      </div>
    )
  }
}