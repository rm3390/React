import React from "react";
import HabitTracker from "./components/HabitTracker";
import AIInsights from "./components/AIInsights";
import DarkModeToggle from "./components/DarkModeToggle";
import "./style.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition duration-300">
      <div className="max-w-2xl mx-auto p-4">
        <DarkModeToggle />
        <h1 className="text-3xl font-bold text-center mb-6">
          🚀 AI Habit Tracker
        </h1>
        <HabitTracker />
        <AIInsights />
      </div>
    </div>
  );
}

export default App;
