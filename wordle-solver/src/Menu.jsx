import React from 'react'
import './Menu.css'
import helpIcon from './assets/helpIcon.png'
import resetIcon from './assets/resetIcon.png'

function Menu({ reset, displayHelp }) {

    function resetHandler() {
        reset()
    }
    
    function helpHandler() {
        displayHelp()
    }

    return (
        <div className='top-menu'>
            <label className='top-menu-item' onClick={resetHandler}>
                <img className='top-menu-icon' src={resetIcon} alt='RESET'></img>
            </label>
            <label className='top-menu-item' onClick={helpHandler}>
                <img className='top-menu-icon' src={helpIcon} alt='HELP'></img>
            </label>
        </div>
    );
}

export default Menu;