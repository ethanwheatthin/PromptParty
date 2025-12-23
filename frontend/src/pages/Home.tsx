import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container">
      <h1>🎭 PromptParty</h1>
      <p>A realtime improv party game</p>
      
      <div className="actions">
        <button className="btn btn-primary">Create Room</button>
        <input 
          type="text" 
          placeholder="Enter join code" 
          className="input"
        />
        <button className="btn btn-secondary">Join Room</button>
      </div>
    </div>
  );
};

export default Home;
