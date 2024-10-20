import React, { useState, useEffect, useCallback } from 'react'
import { PlusCircle, Trash2, CheckCircle, Circle, XCircle, Calendar, Tag } from 'lucide-react'
import { format } from 'date-fns'

const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState(null)

  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)())
  }, [])

  return audioContext
}

const playSound = (audioContext, frequency, duration) => {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = frequency
  oscillator.type = 'sine'

  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01)
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

const eventTypes = [
  { value: 'work', label: 'Work', color: 'bg-blue-200 text-blue-800' },
  { value: 'personal', label: 'Personal', color: 'bg-green-200 text-green-800' },
  { value: 'study', label: 'Study', color: 'bg-yellow-200 text-yellow-800' },
  { value: 'health', label: 'Health', color: 'bg-red-200 text-red-800' },
  { value: 'other', label: 'Other', color: 'bg-gray-200 text-gray-800' },
]

export default function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      return JSON.parse(savedTodos)
    } else {
      return []
    }
  })
  const [newTodo, setNewTodo] = useState('')
  const [newEventType, setNewEventType] = useState(eventTypes[0].value)
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState(null)
  const audioContext = useAudioContext()

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const playAddSound = useCallback(() => {
    if (audioContext) {
      playSound(audioContext, 800, 0.1)
    }
  }, [audioContext])

  const playDeleteSound = useCallback(() => {
    if (audioContext) {
      playSound(audioContext, 400, 0.1)
    }
  }, [audioContext])

  const addTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    setTodos([...todos, { 
      id: Date.now(), 
      text: newTodo, 
      completed: false,
      createdAt: new Date().toISOString(),
      eventType: newEventType
    }])
    setNewTodo('')
    setNewEventType(eventTypes[0].value)
    playAddSound()
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const confirmDelete = (id) => {
    setTodoToDelete(id)
    setShowDeleteWarning(true)
  }

  const deleteTodo = () => {
    setTodos(todos.filter(todo => todo.id !== todoToDelete))
    setShowDeleteWarning(false)
    playDeleteSound()
  }

  const cancelDelete = () => {
    setShowDeleteWarning(false)
    setTodoToDelete(null)
  }

  const confirmClearCompleted = () => {
    setTodoToDelete('completed')
    setShowDeleteWarning(true)
  }

  const clearCompleted = () => {
    const completedCount = todos.filter(todo => todo.completed).length
    setTodos(todos.filter(todo => !todo.completed))
    setShowDeleteWarning(false)
    if (completedCount > 0) {
      playDeleteSound()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 animated-bg">
      <style jsx>{`
        .animated-bg {
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Tushar Mishra's Todo App
      </h1>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <form onSubmit={addTodo} className="flex flex-col mb-4">
          <div className="flex mb-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-grow px-4 py-2 text-gray-700 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <PlusCircle className="w-6 h-6" />
            </button>
          </div>
          <select
            value={newEventType}
            onChange={(e) => setNewEventType(e.target.value)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </form>
        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex flex-col bg-gray-100 rounded-lg p-3 shadow-sm">
              <div className="flex items-center">
                <button onClick={() => toggleTodo(todo.id)} className="mr-2 focus:outline-none">
                  {todo.completed ? 
                    <CheckCircle className="w-6 h-6 text-green-500" /> : 
                    <Circle className="w-6 h-6 text-gray-400" />
                  }
                </button>
                <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.text}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs mr-2 ${eventTypes.find(type => type.value === todo.eventType).color}`}>
                  {eventTypes.find(type => type.value === todo.eventType).label}
                </span>
                <button onClick={() => confirmDelete(todo.id)} className="text-red-500 hover:text-red-700 focus:outline-none">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(todo.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </div>
            </li>
          ))}
        </ul>
        {todos.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
            <span>{todos.filter(todo => !todo.completed).length} items left</span>
            <button onClick={confirmClearCompleted} className="text-blue-500 hover:text-blue-700 focus:outline-none flex items-center">
              <XCircle className="w-4 h-4 mr-1" /> Clear completed
            </button>
          </div>
        )}
      </div>
      {showDeleteWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              {todoToDelete === 'completed'
                ? "Are you sure you want to clear all completed todos?"
                : "Are you sure you want to delete this todo?"}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={todoToDelete === 'completed' ? clearCompleted : deleteTodo}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}