import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import EmotionChart from "./EmotionChart";

const ScreeningResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const aiResult = state?.aiResult;
  const formData = state?.formData;
  const emotions = state?.emotions; 

  if (!aiResult)
    return <div className="text-center mt-10">No results found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-1 py-12 px-6 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-8 border border-gray-100 dark:border-gray-700">

          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">Screening Results & Recommendations</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Personalized therapy goals and activities for your child's growth
            </p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Therapy Goals</h2>
            <ul className="space-y-3">
              {aiResult?.therapy_goals?.map((goal, i) => (
                <li key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                  <div className="w-7 h-7 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold rounded-full">
                    {i + 1}
                  </div>
                  <span className="dark:text-gray-200">{goal}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Recommended Activities</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {aiResult?.activities?.map((activity, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{activity.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{activity.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Emotion Analysis Section */}
          {emotions && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
                Emotional Expression Analysis
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-100 dark:border-gray-600">
                <EmotionChart emotions={emotions} />
              </div>
            </section>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-800 transition"
            >
              Check Again
            </button>
            <button 
              onClick={() => navigate("/pdf-report", { state: { aiResult, formData, emotions } })}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              Download PDF
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScreeningResults;
