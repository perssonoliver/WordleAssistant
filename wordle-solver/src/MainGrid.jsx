import React from 'react';
import './App.css';

const grey = 'rgb(59, 59, 59)';
const yellow = 'rgb(204, 175, 13)';
const green = 'rgb(34, 150, 23)';

function defaultColors() {
  const colors = {};
  for (let i = 0; i < 6; i++) {
    colors[i] = {};
    for (let j = 0; j < 5; j++) {
      colors[i][j] = '';
    }
  }
  return colors;
}

function resetRow(row) {
  for (let j = 0; j < 5; j++) {
    const box = document.getElementById(`col${row}${j}`);
    box.style.backgroundColor = '';
    box.style.borderColor = grey;
  }
}

function MainGrid() {
  const [colors, setColors] = React.useState(defaultColors);

  function changeColor(event) {
    if (event.target.value === '') {
      return;
    }

    const row = event.target.id[3];
    const col = event.target.id[4];
    const color = colors[row][col];

    let newColor;
    if (color === '' || color === green) {
      newColor = grey;
    } else if (color === grey) {
      newColor = yellow;
    } else if (color === yellow) {
      newColor = green;
    }

    const newColors = { ...colors, [row]: { ...colors[row], [col]: newColor } };
    setColors(newColors);

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
              onClick={changeColor}>
            </input>
          ))}
        </div>
      ))}
      </div>
  );
}

export default MainGrid;