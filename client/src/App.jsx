import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home.jsx';

class App extends Component {
  constructor(props) {
    super(props); 
  }
  
  render() {
    const divStyle = {
      textAlign : 'center'
    }
    return (
      <div style={divStyle}>
        <h1 className="title"> Tweet Renderer </h1>
        <i className="fab fa-twitter"></i>
        <Home />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));