import React, { useState, useEffect } from 'react';
import './App.css';

// Interface for recording data structure
interface Recording {
  id: string;
  phoneNumber: string;
  receivedAt: string;
  mp3FileName: string;
  filePath: string;
  fileSize: number;
}

function App() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Fetch recordings from the backend
  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/recordings');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setRecordings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recordings:', err);
      setError('Failed to fetch recordings. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recordings on component mount and periodically
  useEffect(() => {
    fetchRecordings();
    
    // Poll for new recordings every 30 seconds
    const intervalId = setInterval(fetchRecordings, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // Handle playing a recording
  const playRecording = (recordingId: string) => {
    setCurrentlyPlaying(recordingId);
  };

  // Handle audio end
  const handleAudioEnd = () => {
    setCurrentlyPlaying(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Voice Recordings</h1>
        <p>Phone messages received via Mail.app</p>
        <button onClick={fetchRecordings} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </header>
      
      <main>
        {error && <div className="error-message">{error}</div>}
        
        {loading && recordings.length === 0 && <div className="loading">Loading recordings...</div>}
        
        {!loading && recordings.length === 0 && (
          <div className="no-recordings">
            <p>No recordings found.</p>
            <p>Send an email with an MP3 attachment to see it appear here.</p>
          </div>
        )}
        
        <div className="recording-list">
          {recordings.map((recording) => (
            <div key={recording.id} className="recording-card">
              <div className="recording-header">
                <h2>{recording.id}</h2>
                <div className="recording-metadata">
                  <span>From: {recording.phoneNumber}</span>
                  <span>Received: {formatDate(recording.receivedAt)}</span>
                  <span>Size: {formatFileSize(recording.fileSize)}</span>
                </div>
              </div>
              <div className="recording-player">
                {currentlyPlaying === recording.id ? (
                  <div className="now-playing">
                    <audio 
                      controls 
                      autoPlay 
                      onEnded={handleAudioEnd}
                      src={`http://localhost:8080/api/play/${recording.id}`}
                    />
                    <button 
                      className="stop-button"
                      onClick={() => setCurrentlyPlaying(null)}
                    >
                      Stop
                    </button>
                  </div>
                ) : (
                  <button 
                    className="play-button"
                    onClick={() => playRecording(recording.id)}
                  >
                    Play Message
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
