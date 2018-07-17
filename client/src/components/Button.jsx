import React, { Component } from 'react';

// Dynamic button component for rendering different sorting methods
export default class Button extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <button value={this.props.value} onClick={() => this.props.press(this.props.value)}>
      {this.props.name}
      </button>
    )
  }
}