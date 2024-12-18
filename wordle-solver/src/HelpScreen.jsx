import React from 'react'
import './HelpScreen.css'
import exitIcon from './assets/exitIcon.png'

function HelpScreen({ onClose }) {
    return (
        <div className='help-overlay' onClick={onClose}>
            <div className='help-content' onClick={(e) => e.stopPropagation()}>
                <button className='exit-button' onClick={onClose}>
                    <img className='exit-icon' src={exitIcon} alt='X' />
                </button>
                <h2 className='help-item'>Help</h2>
                <p className='help-item'>This is the help screen content.</p>
                <p className='help-item'>This is the help screen content.</p>
                <p className='help-item'>This is the help screen content.</p>
                <p className='help-item'>This is the help screen content.</p>
                <p className='help-item'>This is the help screen content.</p>
                <p className='help-item'>This is the help screen content.</p>
                <p className='help-item'>This is the help screen content.</p>
                <p className='help-item'>This is the help screen content.</p>
                <p className='help-item'>This is the help screen content.</p>
            </div>
        </div>
    );
}

export default HelpScreen;