import React from 'react'
import './Keyboard.css'
import delIcon from './assets/deleteButton.png'; 

const keyboard = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

function Keyboard({ handleKeyPress, screenWidth }) {
    return (
        <div 
            className='keyboard' 
            style={{ 
                width: screenWidth < 500 ? '100%' : `${screenWidth * 0.3}px`,
                height: screenWidth < 500 ? '19vh' : `${screenWidth * 0.3 * 0.33}px`,
                minHeight: screenWidth < 500 ? '19vh' : `${screenWidth * 0.3 * 0.33}px`
            }}
        >
            <div className='key-row'>
                {keyboard[0].split('').map((_, i) => (
                    <label 
                        className='key-label'
                        key={`key_${keyboard[0][i]}`} 
                        id={`key_${keyboard[0][i]}`}
                        onClick={handleKeyPress}>
                        {keyboard[0][i]}
                    </label>
                ))}
            </div>

            <div className='key-row'>
                {keyboard[1].split('').map((_, i) => (
                    <label
                        className='key-label'
                        key={`key_${keyboard[1][i]}`} 
                        id={`key_${keyboard[1][i]}`}
                        onClick={handleKeyPress}>
                        {keyboard[1][i]}
                    </label>
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
                    <label
                        className='key-label'
                        key={`key_${keyboard[2][i]}`} 
                        id={`key_${keyboard[2][i]}`}
                        onClick={handleKeyPress}>
                        {keyboard[2][i]}
                    </label>
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