import React from 'react';
import './App.css';

function WordList({ wordList, fillWord }) {
    const hasWords = wordList.length > 0;

    function wordHandler(event) {
        fillWord(event.target.innerText);
    }

    return (
        <div className='word-list'>
            <h2 className='fs-4 word-list-header'>Suggested words</h2>
            <ul className='list-group'>
                {!hasWords && <li className='list-group-item default-list-item'>--No suggestions--</li>}
                {hasWords && wordList.map((word, i) => (
                    <li 
                        className='list-group-item word-item' 
                        key={`word${i}`} 
                        onDoubleClick={wordHandler}>
                        {word}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WordList;