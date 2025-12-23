import React from 'react';
import { useParams } from 'react-router-dom';

const Host: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <div className="container host-view">
      <h1>Host View</h1>
      <p>Room ID: {roomId}</p>
      
      <div className="qr-code">
        <p>QR Code will appear here</p>
      </div>

      <div className="players-list">
        <h2>Players</h2>
        <p>No players yet</p>
      </div>

      <div className="game-state">
        <h2>Waiting for players...</h2>
      </div>
    </div>
  );
};

export default Host;
