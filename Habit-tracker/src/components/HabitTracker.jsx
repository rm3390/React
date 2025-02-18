import { useState, useEffect } from "react";
import {
  FaPlus,
  FaFire,
  FaTrash,
  FaClock,
  FaTrophy,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [completedHabit, setCompletedHabit] = useState(null);
  const [countdowns, setCountdowns] = useState({});
  const [pastHabits, setPastHabits] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const storedHabits = localStorage.getItem("habits");
    const storedPastHabits = localStorage.getItem("pastHabits");

    if (storedHabits) {
      try {
        const parsedHabits = JSON.parse(storedHabits);
        setHabits(parsedHabits);
      } catch (error) {
        console.error("Error parsing stored habits:", error);
      }
    }
    if (storedPastHabits) {
      try {
        const parsedPastHabits = JSON.parse(storedPastHabits);
        setPastHabits(parsedPastHabits);
      } catch (error) {
        console.error("Error parsing stored past habits:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits]);

  useEffect(() => {
    if (pastHabits.length > 0) {
      localStorage.setItem("pastHabits", JSON.stringify(pastHabits));
    }
  }, [pastHabits]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prevCountdowns) => {
        const updatedCountdowns = {};
        const now = new Date().getTime();
        habits.forEach((habit, index) => {
          const timeLeft = habit.deadline - now;
          if (timeLeft > 0) {
            updatedCountdowns[index] = timeLeft;
          }
        });
        return updatedCountdowns;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [habits]);

  const addHabit = () => {
    if (newHabit.trim() === "" || targetDate.trim() === "") return;

    const now = new Date().getTime();
    const deadline = new Date(targetDate).getTime();

    const newHabitObj = {
      name: newHabit,
      streak: 0,
      deadline: deadline,
      milestone: 0,
      milestoneGoal: 10,
      startTime: now,
      completedDates: [],
    };

    const updatedHabits = [...habits, newHabitObj];
    setHabits(updatedHabits);
    setNewHabit("");
    setTargetDate("");
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
  };

  const confirmDeleteHabit = (index) => {
    setHabitToDelete(index);
    setShowDeleteModal(true);
  };

  const deleteHabit = () => {
    if (habitToDelete !== null) {
      const updatedHabits = habits.filter((_, i) => i !== habitToDelete);
      setHabits(updatedHabits);
      localStorage.setItem("habits", JSON.stringify(updatedHabits));
    }
    setShowDeleteModal(false);
    setHabitToDelete(null);
  };

  const markAsComplete = (index) => {
    const habit = habits[index];
    const now = new Date().getTime();
    const timeSaved = habit.deadline - now;

    const completedHabit = {
      name: habit.name,
      completedDate: new Date().toLocaleDateString(),
      timeSaved,
    };

    const updatedPastHabits = [...pastHabits, completedHabit];
    setPastHabits(updatedPastHabits);
    localStorage.setItem("pastHabits", JSON.stringify(updatedPastHabits));

    setCompletedHabit(completedHabit);
    setShowCongratsModal(true);

    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
  };

  const getProgressPercentage = (startTime, deadline) => {
    const now = new Date().getTime();
    const totalDuration = deadline - startTime;
    const elapsedTime = now - startTime;
    return Math.min(100, (elapsedTime / totalDuration) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatTime = (milliseconds) => {
    if (milliseconds <= 0) return "Time's up!";
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const clearHistory = () => {
    setPastHabits([]); // Clear the state
    localStorage.removeItem("pastHabits");
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg max-w-lg mx-auto my-7">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          <FaHistory />
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="New habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          className="flex-grow p-2 border rounded text-black"
        />
        <input
          type="datetime-local"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="p-2 border rounded text-black"
        />
        <button
          onClick={addHabit}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          <FaPlus />
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {habits.map((habit, index) => {
          const timeLeft =
            countdowns[index] || habit.deadline - new Date().getTime();
          const progressPercentage = getProgressPercentage(
            habit.startTime,
            habit.deadline
          );

          return (
            <li
              key={index}
              className="flex flex-col bg-gray-800 p-3 rounded-lg transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{habit.name}</span>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded">
                  <FaClock className="inline mr-1" /> {formatTime(timeLeft)}
                </span>
              </div>

              <div className="mt-2 w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(progressPercentage)}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <button className="flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  <FaFire className="mr-1" /> {habit.streak}
                </button>

                {habit.milestone > 0 && (
                  <span className="flex items-center text-sm bg-yellow-500 px-3 py-1 rounded">
                    <FaTrophy className="mr-1" /> {habit.milestone}
                  </span>
                )}

                <button
                  onClick={() => markAsComplete(index)}
                  className="flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  <FaCheckCircle className="mr-1" /> Complete
                </button>

                <button
                  onClick={() => confirmDeleteHabit(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <FaExclamationTriangle className="text-yellow-400 text-3xl mx-auto mb-3" />
            <p className="text-lg">
              Are you sure you want to delete this habit?
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={deleteHabit}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Aur Kaa 😒
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Nahi Bhai 🤨
              </button>
            </div>
          </div>
        </div>
      )}

      {showCongratsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-green-400">
              🎉 Congratulations!
            </h3>
            <p className="mt-2">
              You completed <strong>{completedHabit?.name}</strong>{" "}
              {formatTime(completedHabit?.timeSaved)} earlier!
            </p>
            <button
              onClick={() => setShowCongratsModal(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 w-64 bg-gray-800 p-4 shadow-lg"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Past Habits</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-white"
              >
                <FaTimes />
              </button>
            </div>
            <ul className="space-y-2">
              {pastHabits.map((habit, index) => (
                <motion.li
                  key={index}
                  className="bg-gray-700 p-2 rounded"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="font-semibold">{habit.name}</p>
                  <p className="text-sm text-gray-400">
                    Completed: {habit.completedDate}
                  </p>
                  <p className="text-sm text-green-400">
                    Time saved: {formatTime(habit.timeSaved)}
                  </p>
                </motion.li>
              ))}
            </ul>

            <button
              onClick={clearHistory}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
            >
              Clear All History
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
