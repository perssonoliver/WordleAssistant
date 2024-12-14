import React from 'react';
import './App.css';

const grey = 'rgb(59, 59, 59)';
const yellow = 'rgb(204, 175, 13)';
const green = 'rgb(34, 150, 23)';

function MainGrid({ changeColor, getColor }) {

  function changeColorHandler(event) {
    if (event.target.value === '') {
      return;
    }

    const row = event.target.id[3];
    const col = event.target.id[4];
    const color = getColor(row, col);

    let newColor;
    if (color === '' || color === green) {
      newColor = grey;
    } else if (color === grey) {
      newColor = yellow;
    } else if (color === yellow) {
      newColor = green;
    }

    changeColor(row, col, newColor);

    event.target.style.backgroundColor = newColor;
    event.target.style.borderColor = newColor;
  }

  return (
    <div className="main-grid">
        {[...Array(6)].map((_, i) => (
        <div className="row grid-row" key={`row${i}`}>
          {[...Array(5)].map((_, j) => (
            <input 
            className="col grid-col"  
              type="text" 
              maxLength="1" 
              key={`col${i}${j}`}
              id={`col${i}${j}`}
              onClick={changeColorHandler}>
            </input>
          ))}
        </div>
      ))}
      </div>
  );
}

export default MainGrid;