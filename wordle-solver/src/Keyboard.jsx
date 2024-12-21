import React from 'react'
import './Keyboard.css'
import delIcon from './assets/deleteButton.png'; 

const keyboard = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

function Keyboard({ handleKeyPress, screenWidth }) {
    return (
        <div 
            className='keyboard' 
            style={{ 
                width: `${screenWidth * 0.32}px`,
                height: `${screenWidth * 0.32 * 0.35}px`
            }}
        >
            <div className='key-row'>
            {keyboard[0].split('').map((_, i) => (
                    <li 
                        key={`key_${keyboard[0][i]}`} 
                        id={`key_${keyboard[0][i]}`}
                        onClick={handleKeyPress}>
                        {keyboard[0][i]}
                    </li>
                ))}
            </div>

            <div className='key-row'>
                {keyboard[1].split('').map((_, i) => (
                    <li
                        key={`key_${keyboard[1][i]}`} 
                        id={`key_${keyboard[1][i]}`}
                        onClick={handleKeyPress}>
                        {keyboard[1][i]}
                    </li>
                ))}
            </div>

            <div className='key-row'>
                <label 
                    className='special-key-label'
                    key={'key_ENTER'} 
                    id={'key_ENTER'} 
                    onClick={handleKeyPress}>
                    {'ENTER'}
                </label>
                {keyboard[2].split('').map((_, i) => (
                    <li
                        key={`key_${keyboard[2][i]}`} 
                        id={`key_${keyboard[2][i]}`}
                        onClick={handleKeyPress}>
                        {keyboard[2][i]}
                    </li>
                ))}
                <label 
                    className='special-key-label'
                    key={'key_DEL'} 
                    id={'key_DEL'} 
                    onClick={handleKeyPress}>
                    <img className='del-icon' src={delIcon} alt='DEL' />
                </label>
            </div>
        </div>
    );
}

export default Keyboard;