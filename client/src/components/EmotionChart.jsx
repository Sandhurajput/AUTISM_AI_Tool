import React from "react";
import { motion } from "framer-motion";

const EmotionChart = ({ emotions }) => {
  if (!emotions) return null;

  const emotionConfig = {
    happy: { color: "bg-green-500", emoji: "😊", label: "Happy" },
    sad: { color: "bg-blue-500", emoji: "😢", label: "Sad" },
    angry: { color: "bg-red-500", emoji: "😠", label: "Angry" },
    fearful: { color: "bg-purple-500", emoji: "😨", label: "Fearful" },
    disgusted: { color: "bg-orange-500", emoji: "🤢", label: "Disgusted" },
    surprised: { color: "bg-yellow-500", emoji: "😮", label: "Surprised" },
    neutral: { color: "bg-gray-500", emoji: "😐", label: "Neutral" },
  };

  // Convert emotions object to array and sort by value
  const emotionArray = Object.entries(emotions)
    .map(([name, value]) => ({
      name,
      value: value * 100, // Convert to percentage
      config: emotionConfig[name],
    }))
    .sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...emotionArray.map((e) => e.value));

  return (
    <motion.div
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
        🎭 Emotion Analysis Results
      </h3>

      <div className="space-y-3">
        {emotionArray.map((emotion, index) => (
          <motion.div
            key={emotion.name}
            className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-600"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{emotion.config.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {emotion.config.label}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {emotion.value.toFixed(1)}%
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {emotion.value.toFixed(0)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full ${emotion.config.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${emotion.value}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dominant Emotion Card */}
      <motion.div
        className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 rounded-xl border-2 border-indigo-200 dark:border-indigo-700"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-2">
          Dominant Emotion Detected
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl">{emotionArray[0].config.emoji}</span>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              {emotionArray[0].config.label}
            </p>
            <p className="text-lg text-indigo-600 dark:text-indigo-400">
              {emotionArray[0].value.toFixed(1)}% confidence
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmotionChart;
