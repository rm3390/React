import React, { useState, useEffect } from 'react'
import { Sun, Moon, Cloud, CloudRain, CloudLightning } from 'lucide-react'

const moodEmojis = {
  great: <Sun className="w-8 h-8 text-yellow-400" />,
  good: <Sun className="w-8 h-8 text-yellow-300" />,
  okay: <Cloud className="w-8 h-8 text-gray-400" />,
  bad: <CloudRain className="w-8 h-8 text-blue-400" />,
  awful: <CloudLightning className="w-8 h-8 text-purple-500" />,
}

const moodColors = {
  great: 'bg-yellow-100',
  good: 'bg-yellow-50',
  okay: 'bg-gray-100',
  bad: 'bg-blue-100',
  awful: 'bg-purple-100',
}

function App() {
  const [currentMood, setCurrentMood] = useState('okay')
  const [moodHistory, setMoodHistory] = useState([])
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood)
  }

  const handleMoodSubmit = () => {
    const newMoodEntry = {
      mood: currentMood,
      timestamp: new Date().toISOString(),
    }
    setMoodHistory([...moodHistory, newMoodEntry])
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Mood Tracker</h1>
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-gray-700">{formatDate(currentDateTime)}</p>
            <p className="text-xl font-bold text-gray-800">{formatTime(currentDateTime)}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">How are you feeling today?</h2>
            <div className="flex justify-between">
              {Object.keys(moodEmojis).map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className={`p-3 rounded-full transition duration-300 ${
                    currentMood === mood ? moodColors[mood] : 'bg-gray-100'
                  }`}
                >
                  {moodEmojis[mood]}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleMoodSubmit}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Log Mood
          </button>
        </div>
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Your Mood History</h2>
          <div className="space-y-2">
            {moodHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
                <div className={`p-2 rounded ${moodColors[entry.mood]}`}>
                  {moodEmojis[entry.mood]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App