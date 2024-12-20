import React from 'react'
import './HelpScreen.css'
import exitIcon from './assets/exitIcon.png'

function HelpScreen({ onClose, screenWidth }) {
    return (
        <div className='help-overlay' onClick={onClose}>
            <div 
                className='help-content' 
                style={{ width: `${screenWidth * 0.27}px` }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className='exit-button' onClick={onClose}>
                    <img className='exit-icon' src={exitIcon} alt='X' />
                </button>
                <p className='help-header fs-2'>INSTRUCTIONS</p>
                <ul className='help-list'>
                    <li>Insert characters in the current row by pressing the keys on the keyboard.</li>
                    <li>Modify the color of the character tile by pressing it, so that it matches 
                        the color from Wordle.</li>
                    <li>When all five characters are colored, press Enter to display a list of possible 
                        valid words.</li>
                </ul>
                <p className='help-header fs-5'>Other tips</p>
                <ul className='help-list'>
                    <li>Double click a word from the word list to quick apply it.</li>
                    <li>Reset the tiles by pressing the reset button in the top menu.</li>
                </ul>
            </div>
        </div>
    );
}

export default HelpScreen;