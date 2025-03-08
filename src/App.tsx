import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Interface for recording data structure
interface Recording {
  id: string;
  phoneNumber: string;
  receivedAt: string;
  mp3FileName: string;
  filePath: string;
  fileSize: number;
  title: string;
  transcription: string;
}

function App() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Get API URL from environment variables with fallback
  const apiUrl = 'https://abcdefgh-mbp.tail97dd03.ts.net'
  
  // Fetch recordings from the backend
  const fetchRecordings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/recordings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data: Recording[] = await response.json();
      data.sort((a, b) => {
        let aReceivedAt = new Date(a.receivedAt)
        let bReceivedAt = new Date(b.receivedAt)

        if (aReceivedAt < bReceivedAt) {
          return Infinity
        }
        return -Infinity
      })
      
      setRecordings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recordings:', err);
      setError('Failed to fetch recordings. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Fetch recordings on component mount and periodically
  useEffect(() => {
    fetchRecordings();
    
    // Poll for new recordings every 30 seconds
    const intervalId = setInterval(fetchRecordings, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchRecordings]);

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
        <h1>Every time I'd like to call</h1>
        <p>Messages from calling <a className="hailmix-link" href="tel:+1559HAILMIX">+1 (559) HAILMIX</a></p>
      </header>
      <main>
        {error && <div className="error-message">{error}</div>}
        
        {loading && recordings.length === 0 && <div className="loading">Loading recordings...</div>}
        
        {!loading && !error && recordings.length === 0 && (
          <div className="no-recordings">
            <p>No messages found.</p>
            <p>Call <a className="hailmix-link" href="tel:+1559HAILMIX">+1 (559) HAILMIX</a> to leave a message.</p>
          </div>
        )}
      
        
        <div className="recording-list">
          {recordings.map((recording) => (
            <div key={recording.id} className="recording-card">
              <div className="recording-header">
                <h2>{recording.title}</h2>
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
                      src={`${apiUrl}/api/play/${recording.id}`}
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
                <details className="recording-transcription">
                  <summary>View Transcription</summary>
                  <pre className="transcription-text">
                    {recording.transcription}
                  </pre>
                </details>

              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
