import React from 'react';
import './App.css';

function WordList({ wordList }) {
    return (
        <div className='word-list'>
            <h2 className='fs-4'>Suggested words</h2>
            <ul className="list-group">
                {wordList.map((word, i) => (
                    <li className="list-group-item" key={`word${i}`}>{word}</li>
                ))}
            </ul>
        </div>
    );
}

export default WordList;