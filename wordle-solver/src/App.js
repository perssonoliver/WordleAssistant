import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="container my-5">
      <header className="text-center mb-4">
        <h1>Welcome to My Website</h1>
        <p className="lead">A simple website built with React and Bootstrap</p>
      </header>
      <main>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">About Us</h5>
            <p className="card-text">This is a basic React website styled with Bootstrap.</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Contact</h5>
            <p className="card-text">Email us at: contact@example.com</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
