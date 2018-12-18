import React from 'react';

const Instructions = () => {
 return (
   <div className="text">
    <article>
      <h1>Minesweeper Instructions</h1>
      <p>Find the mines <span role="img" aria-label="water drops">💣</span> hidden in the grid.  Left click a square to uncover the value hidden beneath.
         Each square will show the number of mines to be found
         in neighboring squares.</p>
      <p>If there are no mines in neighboring squares, then the square
         will contain a <span role="img" aria-label="water drops">💦</span>, and all neighboring non-mine squares will be uncovered. If you uncover all the non-mine squares, you win.
      </p>
      <p>
      To mark the location of a mine with a <span role="img" aria-label="flag">🚩</span>, right click the square. Right click a second time if you wish to remove the flag.
      
      </p>
      <p> 
        If you left click a mine you will see <span role="img" aria-label="flames">🔥</span>, and the game is over.  To try again
        click the smiley face at the top of the board.  See how fast you can clear the board!
      </p>
    </article>
   </div>
 )
}

export default Instructions;