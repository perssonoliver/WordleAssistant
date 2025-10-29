import React from 'react'
import './MainGrid.css'

function MainGrid({ setColorHandler, screenWidth }) {

    function handleAnimationEnd(event) {
        event.target.classList.remove('pop-animation');
    }

    return (
        <div className='main-grid' style={{ width: screenWidth < 500 ? '100%' : `${screenWidth * 0.2}px` }}>
              {[...Array(6)].map((_, i) => (
                  [...Array(5)].map((_, j) => (
                      <label 
                            maxLength='1'
                            key={`col${i}${j}`}
                            id={`col${i}${j}`}
                            onClick={setColorHandler}
                            onAnimationEnd={handleAnimationEnd}
                            autoComplete='off'
                        >
                            <span className="letter-content" id={`col${i}${j}letter`}></span>
                      </label>
                  ))
            ))}
        </div>
    );
}

export default MainGrid;