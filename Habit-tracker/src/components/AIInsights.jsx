import { useState } from "react";

const TOGETHER_API_KEY = process.env.REACT_APP_TOGETHER_API_KEY;

export default function AIInsights() {
  const [userPrompt, setUserPrompt] = useState("");
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [background, setBackground] = useState("bg-gray-800");

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "mr", name: "मराठी (Marathi)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
  ];

  const fetchAIInsights = async () => {
    if (!userPrompt.trim()) {
      setInsights("⚠️ Please enter a question first!");
      return;
    }

    setLoading(true);

    try {
      const prompt =
        language === "en"
          ? `Provide a detailed, well-structured response to this question: ${userPrompt}`
          : `Translate this question to ${language}, answer in that language, and format the response properly: ${userPrompt}`;

      const response = await fetch(
        "https://api.together.xyz/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOGETHER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
          }),
        }
      );

      const data = await response.json();
      const answer =
        data.choices?.[0]?.message?.content || "⚠️ No response received.";

      setInsights(answer);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setInsights("❌ Failed to load insights.");
    }

    setLoading(false);
  };

  e;
  const clearResponse = () => {
    setInsights("");
    setUserPrompt("");
    setBackground("bg-gray-800");
  };

  return (
    <div
      className={`mt-6 p-6 ${background} text-white rounded-lg shadow-lg transition-all duration-500`}
    >
      <h2 className="text-2xl font-bold mb-4">🧠 AI Insights</h2>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-2 mb-3 text-lg text-black rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="📝 Ask anything..."
        className="w-full p-3 mb-3 text-lg text-black rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex gap-2">
        <button
          onClick={fetchAIInsights}
          className="flex-1 bg-blue-500 text-white text-lg font-semibold px-5 py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            "🚀 Get AI Response"
          )}
        </button>

        {(userPrompt || insights) && (
          <button
            onClick={clearResponse}
            className="bg-red-500 text-white text-lg font-semibold px-5 py-3 rounded-lg hover:bg-red-600 transition"
          >
            🗑️ Clear
          </button>
        )}
      </div>

      {insights && (
        <pre className="mt-4 p-4 bg-gray-700 text-lg leading-relaxed rounded-lg whitespace-pre-wrap">
          {insights}
        </pre>
      )}
    </div>
  );
}
