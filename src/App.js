import React, { useState, useEffect } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";

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

      const response = await fetch('https://f976-13-48-42-168.ngrok-free.app/api/send-requests', {
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
      className="min-h-screen bg-fixed bg-cover bg-center flex flex-col items-center px-4 animate-fadeIn"
      style={{
        backgroundImage: "url('https://media.giphy.com/media/3o7TKzPMUxyN3n4XyE/giphy.gif')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      <main className="bg-white bg-opacity-90 rounded-xl p-6 my-6 max-w-3xl w-full shadow-lg text-black">
        <h1 className="text-3xl font-bold mb-4 text-center">Website Down Tester</h1>
        <p className="mb-4 text-sm text-gray-700 text-center">
          Enter a website URL and the number of simulated requests to check if the site is responsive. 
          This tool is strictly for educational purposes. Max: 100 requests.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter website URL"
            className="flex-1 p-3 rounded border border-gray-400"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            type="number"
            placeholder="Requests (1-100)"
            className="w-48 p-3 rounded border border-gray-400"
            value={requestCount}
            onChange={(e) => setRequestCount(e.target.value)}
            min="1"
            max="100"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded"
            onClick={handleStart}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Start'}
          </button>
        </div>

        <div className="text-center text-gray-800 font-mono text-lg mb-2">
          Requests Sent: <span className="font-semibold">{sentRequests}</span>
        </div>

        <p className="text-center text-xs text-red-600 font-mono">
          ⚠️ This simulator is for educational/testing purposes only.
        </p>
      </main>

      <section className="bg-white bg-opacity-90 text-sm rounded-xl p-6 max-w-3xl w-full mb-6 text-gray-700">
        <h2 className="text-lg font-semibold mb-2">Disclaimer</h2>
        <p>
          This tool does not perform any malicious activity. It is intended for responsible developers and testers to evaluate basic response behavior.
        </p>

        <h2 className="text-lg font-semibold mt-4 mb-2">Privacy Policy</h2>
        <p>
          We do not store your input or track user data. However, we use third-party services like Google AdSense that may use cookies.
        </p>

        <h2 className="text-lg font-semibold mt-4 mb-2">Contact</h2>
        <p>
          Have suggestions or concerns? Reach out at <a href="mailto:contact@example.com" className="text-blue-600 underline">contact@example.com</a>.
        </p>
      </section>

      <footer className="text-center text-xs text-gray-600 mb-4">
        &copy; {new Date().getFullYear()} Website Down Tester | <a href="#" className="underline">Privacy Policy</a>
      </footer>

      <SpeedInsights />
    </div>
  );
}