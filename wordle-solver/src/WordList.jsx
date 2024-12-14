import React from 'react';
import './App.css';

function WordList() {
    return (
        <div className='word-list'>
            <h2>Word List</h2>
            <ul className="list-group">
                <li className="list-group-item">An active item</li>
                <li className="list-group-item">A second item</li>
                <li className="list-group-item">A third item</li>
                <li className="list-group-item">A fourth item</li>
                <li className="list-group-item">And a fifth one</li>
                <li className="list-group-item">And a fifth one</li>
                <li className="list-group-item">And a fifth one</li>
                <li className="list-group-item">And a fifth one</li>
            </ul>
        </div>
    );
}

export default WordList;