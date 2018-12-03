import React, { Component } from 'react';
import Square from './Square.js';

class Grid extends Component {

  makeGrid(width, height) {
    const grid = [];
    for (let row = 0; row < height; row++) {
      const rowArr = [];
      for (let col = 0; col < width; col++) {
        const square = {
          row,
          col,
          val: 'blank',
          char: '💦',
          handleClick : (e, ss) => {
            console.log(ss.row, ss.col, 'was clicked')
          }
        }
        square.handleClick = square.handleClick.bind(square);
        rowArr.push(square);
      }
      grid.push(rowArr);
    }

    for (let count = 0; count < 99; count++) {
      let randRow = Math.floor(Math.random() * height);
      let randCol = Math.floor(Math.random() * width);
      if (grid[randRow][randCol].val === 'blank') {
        grid[randRow][randCol].val = 'mine';
        grid[randRow][randCol].char = '🔥'
      } else {
        count--;
      }
    }
    let countMines = grid.reduce((acc, row) => {
      return acc + row.reduce((a, v) => v.val === 'mine' ? a + 1 : a + 0, 0)
    }, 0)
    console.log('countMines: ', countMines);
    return grid;
  }

  makeRow(row, idx) { 
    return (
      <div className="row" key={idx}>
      {row.map((val) => {
        return <Square key={val.row + '-' + val.col}squareStuff={val} char={'g'}/>
      })}
      </div>
    )
  }
  render() {
   const grid = this.makeGrid(30, 16);

   return(


    <div>
      {grid.map((row, idx) => this.makeRow(row, idx))}
    </div>
   )
  }
}

export default Grid;