import React, { Component } from 'react';
import SortingButton from './SortingButton.jsx'
import axios from 'axios';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hashtag: '',
      tweets: [],
      storedTweets: [],
      numberOfTweets: 15,
    }
    this.fetchTweets = this.fetchTweets.bind(this);
    this.grabHashtag = this.grabHashtag.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
    this.sliceTweets = this.sliceTweets.bind(this);
    this.sortCriteria = this.sortCriteria.bind(this);
  }
  
  //gets the tweets for an associated hashtag
  async fetchTweets() {
    try {
      let { hashtag } = this.state;
      hashtag = hashtag.replace(/\s/g, '').split('#');
      hashtag.shift();
      const tweets = await axios.post(`https://quiet-cliffs-20902.herokuapp.com/twitter/getTweetsForHashtag`, { hashtag })
      const { data } = tweets;
      await this.setState({
        tweets: data.statuses,
        storedTweets: data.statuses,
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

  //fetches tweets on pressing of enter/return button
  onEnterPress(e) {
    if (e.which === 13) {
      this.fetchTweets();
    }
  }

  //slices tweets to specified number by user
  sliceTweets(e) {
    let newTweets = this.state.storedTweets
    newTweets = newTweets.slice(0, parseInt(e.target.value));
    this.setState({
      tweets: newTweets
    })
  }

  //dynamically sorts tweets according to the criteria entered as an argument
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
          onKeyPress={this.onEnterPress}
          />
          <button type="submit" className="submit" onClick={this.fetchTweets}> 
            Submit 
          </button>
          <br/>
          Filter results: 
          <select className={"styled-select"}onChange={this.sliceTweets} defaultValue="30">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
          </select>
        </h2>
        <h2> Sort by: 
          <br/>
          <br/>
          <SortingButton value={'favorite_count'} name={'Favorite count'} press={this.sortCriteria}/>
          <SortingButton value={'retweet_count'} name={'Retweet count'} press={this.sortCriteria}/>
          <SortingButton value={'created_at'} name={'Time created'} press={this.sortCriteria}/>
        </h2>
        <div className="tweet-container">
          {this.state.tweets.length > 0 ? this.state.tweets.map((tweet, i) => {
            return (
              <div key={i}> 
                <div className="tweet-box">
                  <img className="profile-img" src={tweet.user.profile_image_url}/> 
                  <div className="tweet-name-container">
                    {tweet.user.name} <a href={tweet.user.url} target="_blank"> @{tweet.user.screen_name} </a>
                    <small>{tweet.created_at}</small>
                  </div>
                  <div className="tweet-text-container">
                    {tweet.text}
                    <br/>
                    <div className="tweet-icon-container">
                      <div className="favorite-container">
                        <i className="far fa-heart"></i> {tweet.favorite_count}  
                      </div>
                      <div className="retweet-container">
                        <i className="fas fa-retweet"></i> {tweet.retweet_count}
                      </div>
                    </div>
                  </div>
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