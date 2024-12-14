import React from 'react'
import './App.css'

function MainGrid({ changeColor }) {

  function changeColorHandler(event) {
    if (event.target.value === '') {
      return
    }

    const row = event.target.id[3]
    const col = event.target.id[4]

    changeColor(event.target, row, col)
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