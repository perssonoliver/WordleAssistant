import React from 'react'
import './MainGrid.css'

function MainGrid({ row, setColor, screenWidth }) {

  function setColorHandler(event) {
    const letter = event.target.value
    const currRow = event.target.id[3]

    if (letter === '' || currRow < row) {
      return
    }

    setColor(event.target)
  }

  return (
    <div className='main-grid' style={{ width: `${screenWidth * 0.2}px` }}>
        {[...Array(6)].map((_, i) => (
        <div className='row grid-row' key={`row${i}`}>
          {[...Array(5)].map((_, j) => (
            <input 
              className='col grid-col'
              type='text'
              maxLength='1'
              key={`col${i}${j}`}
              id={`col${i}${j}`}
              onClick={setColorHandler}
              autoComplete='off'>
            </input>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MainGrid;