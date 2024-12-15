import React from 'react'
import './App.css'

const keyboard = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

function Keyboard({ setBoxCharacter }) {
    return (
        <div>
            <div className='key-row'>
            {keyboard[0].split('').map((_, i) => (
                <li 
                    key={`key_${keyboard[0][i]}`} 
                    onClick={setBoxCharacter}>
                    <label 
                        className='key-label'
                        id={`key_${keyboard[0][i]}`}>
                        {keyboard[0][i]}
                    </label>
                </li>
                ))}
            </div>

            <div className='key-row'>
                {keyboard[1].split('').map((_, i) => (
                <li
                    key={`key_${keyboard[1][i]}`} 
                    onClick={setBoxCharacter}>
                    <label 
                        className='key-label' 
                        id={`key_${keyboard[1][i]}`}>
                        {keyboard[1][i]}
                    </label>
                </li>
                ))}
            </div>

            <div className='key-row'>
                <label 
                    className='enter-key-label'
                    key={'key_ENTER'} 
                    id={'key_ENTER'} 
                    onClick={setBoxCharacter}>
                    {'ENTER'}
                </label>
                {keyboard[2].split('').map((_, i) => (
                <li
                    key={`key_${keyboard[2][i]}`} 
                    onClick={setBoxCharacter}>
                    <label 
                        className='key-label'
                        id={`key_${keyboard[2][i]}`}>
                        {keyboard[2][i]}
                    </label>
                </li>
                ))}
                <label 
                className='del-key-label'
                key={'key_DEL'} 
                id={'key_DEL'} 
                onClick={setBoxCharacter}>
                {'DEL'}
                </label>
            </div>
        </div>
    );
}

export default Keyboard;