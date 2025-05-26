import React, { useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function App() {
  const [url, setUrl] = useState('');
  const [requestCount, setRequestCount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentRequests, setSentRequests] = useState(0);

  const handleStart = async () => {
    const countLimit = parseInt(requestCount);
    if (!url || isNaN(countLimit) || countLimit <= 0 || countLimit > 100) {
      alert('Please enter a valid URL and a number of requests between 1 and 100.');
      return;
    }

    try {
      setIsSending(true);
      setSentRequests(0);
      const response = await fetch('https://discusses-sin-produce-task.trycloudflare.com/api/send-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, count: countLimit }),
      });

      if (response.ok) {
        let counter = 0;
        const interval = setInterval(() => {
          counter++;
          setSentRequests(prev => prev + 1);
          if (counter >= countLimit) {
            clearInterval(interval);
            setIsSending(false);
          }
        }, 100);
      } else {
        alert("Backend error. Try again.");
        setIsSending(false);
      }

    } catch (error) {
      alert("Failed to connect to backend.");
      setIsSending(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center flex flex-col justify-center items-center px-4 animate-pulse"
      style={{
        backgroundImage: "url('https://media.giphy.com/media/3o7TKzPMUxyN3n4XyE/giphy.gif')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      <div className="bg-black bg-opacity-70 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-2xl w-full border border-lime-400">
        <h1 className="text-3xl text-lime-400 font-mono font-bold text-center mb-6">Load Testing Simulator</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter website URL"
            className="flex-1 p-3 rounded-lg bg-black bg-opacity-50 text-lime-200 placeholder-lime-500 border border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            type="number"
            placeholder="Requests (Max 100)"
            className="w-48 p-3 rounded-lg bg-black bg-opacity-50 text-lime-200 placeholder-lime-500 border border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
            value={requestCount}
            onChange={(e) => setRequestCount(e.target.value)}
            min="1"
            max="100"
          />
          <button
            className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md"
            onClick={handleStart}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Start'}
          </button>
        </div>
        <div className="text-lime-300 text-center font-mono text-lg mb-2">
          Requests Sent: <span className="text-lime-400 font-semibold">{sentRequests}</span>
        </div>
        <p className="text-center text-sm text-red-500 font-mono">
  ⚠️ This tool is for educational purposes only. A maximum of 100 requests is allowed.
</p>
      </div>
      <SpeedInsights />
    </div>
  );
}
