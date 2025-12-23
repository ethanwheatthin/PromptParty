import React from 'react';
import { useParams } from 'react-router-dom';

const Player: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <div className="container player-view">
      <h1>Player View</h1>
      <p>Room: {roomId}</p>
      
      <div className="name-entry">
        <input 
          type="text" 
          placeholder="Enter your name" 
          className="input"
        />
        <button className="btn btn-primary">Join</button>
      </div>

      <div className="game-actions">
        <p>Waiting for game to start...</p>
      </div>
    </div>
  );
};

export default Player;
