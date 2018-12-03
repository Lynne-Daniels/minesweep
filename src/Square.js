import React, {Component} from 'react';

class Square extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      emoji: ''
    }
  }

  handleClick (e) {
    e.preventDefault();
    this.props.squareStuff.handleClick(e, this.props.squareStuff);
    this.setState({clicked: true, emoji: this.props.squareStuff.char})
  }


  render () {

    return (
      <div>
        <div className="square" onClick={this.handleClick.bind(this)}>{this.state.emoji}</div>
      </div>
    );
  }
}

export default Square;