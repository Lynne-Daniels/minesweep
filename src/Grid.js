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
          count:0,
          handleClick : (e, ss) => {
            console.log(ss.row, ss.col, 'was clicked')
          }
        }
        square.handleClick = square.handleClick.bind(square);
        rowArr.push(square);
      }
      grid.push(rowArr);
    }
    // add mines
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
    // test count Mines
    let countMines = grid.reduce((acc, row) => {
      return acc + row.reduce((a, v) => v.val === 'mine' ? a + 1 : a + 0, 0)
    }, 0)
    console.log('countMines: ', countMines);
    // add numbers
    // loop over all the squares
    grid.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        // loop over neighboring squares
        const topRow = rowIdx - 1;
        const bottomRow = rowIdx + 1;
        const leftCol = colIdx - 1;
        const rightCol = colIdx + 1;
        let count = 0;
        for (let r = topRow; r <= bottomRow; r++) {
          for (let c = leftCol; c <= rightCol; c++) {
            if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || (r === rowIdx && c === colIdx)) {
              // do nothing - ignore self and ignore off the grid cells
            } else if (grid[r][c].val === 'mine') {
              // if neighboring square exists and has mine: count++
              grid[rowIdx][colIdx].count++;
            }
          }
        }
        if (grid[rowIdx][colIdx].val !== 'mine' && grid[rowIdx][colIdx].count !== 0)
        grid[rowIdx][colIdx].char = grid[rowIdx][colIdx].count.toString();
        
      })
    })
    // assign count to current squares value and char
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