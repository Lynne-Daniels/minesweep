import React, {Component} from 'react';

class Square extends Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     clicked: false,
  //   }
  // }

  handleClick (e) {
    e.preventDefault();
    this.props.squareStuff.handleClick(e, this.props.squareStuff);
    // this.setState({clicked: true})
  }

  clearNeighbors () {

  }


  render () {

    return (
      <div>
        <div className="square" onClick={this.handleClick.bind(this)}>{this.props.squareStuff.isCleared ? this.props.squareStuff.char : ''}</div>
      </div>
    );
  }
}

export default Square;