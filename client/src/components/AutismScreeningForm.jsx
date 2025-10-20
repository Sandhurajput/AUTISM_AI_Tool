import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import Header from "./Header";
import EmotionChart from "./EmotionChart";

const AutismScreeningForm = () => {
  const [formData, setFormData] = useState({
    ChildName: "",
    ParentsName: "",
    age: "",
    eyeContact: "",
    speechLevel: "",
    socialResponse: "",
    sensoryReactions: "",
  });

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [emotions, setEmotions] = useState(null);
  const [analyzingEmotion, setAnalyzingEmotion] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Load face-api.js models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingModels(true);
        const MODEL_URL = "/models";
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        setModelsLoaded(true);
        setLoadingModels(false);
        console.log("✅ Face-api.js models loaded successfully!");
      } catch (err) {
        console.error("❌ Error loading models:", err);
        setLoadingModels(false);
        setError("Failed to load emotion detection models. Photo upload may not work.");
      }
    };

    loadModels();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or WebP)");
        e.target.value = null;
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError("Image size should be less than 5MB. Please choose a smaller image.");
        e.target.value = null;
        return;
      }

      setError(null);
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setEmotions(null); // Reset previous emotions
    }
  };

  // Analyze emotions from uploaded image
  const analyzeEmotions = async () => {
    if (!selectedImage || !modelsLoaded) {
      setError("Please select an image first and wait for models to load.");
      return;
    }

    setAnalyzingEmotion(true);
    setError(null);

    try {
      const img = imageRef.current;
      
      // Detect face and emotions
      const detections = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        setEmotions(detections.expressions);
        console.log("✅ Emotions detected:", detections.expressions);
        
        // Draw detection on canvas
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const displaySize = { width: img.width, height: img.height };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }
      } else {
        setError("No face detected in the image. Please upload a clear photo with a visible face.");
      }
    } catch (err) {
      console.error("❌ Error analyzing emotions:", err);
      setError("Failed to analyze emotions. Please try another image.");
    } finally {
      setAnalyzingEmotion(false);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user uploaded photo but didn't analyze it
    if (selectedImage && !emotions) {
      setError("Please click 'Analyze Emotions' button before submitting the form, or remove the photo.");
      return;
    }
    
    setLoading(true);
    setError(null);

    // Backend 'sensoryReactions' ko ek array expect karta hai
    const dataToSend = {
      ...formData,
      sensoryReactions: [formData.sensoryReactions],
      emotions: emotions ? emotions : null, // Include emotion data if available
    };

   try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/analyze';
      console.log("🔄 Sending request to:", apiUrl);
      console.log("📦 Data being sent:", dataToSend);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server response:", response.status, errorText);
        throw new Error(`Server error: ${response.status}`);
      }

  
   const aiResult = await response.json();
    console.log("✅ AI Result received:", aiResult);
    console.log("📊 Emotions data:", emotions);
      
      navigate("/results", { state: { aiResult, formData, emotions } });

    } catch (err) {
      console.error("❌ Full error:", err);
      setError(`Failed to get AI analysis: ${err.message}. Please check if server is running.`);

      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Header />
      
      <div className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <motion.div
          className="text-center mt-16 px-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
        <h2 className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-400 shadow">
          ⚙️ AI-Powered + Emotion Recognition
        </h2>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mt-6">
          Empowering Early Autism Detection
        </h1>
        <motion.div
          className="h-2 w-56 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />

        <p className="mt-6 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg">
          A calm, intelligent space for screening and personalized therapy
          planning. Get AI-assisted insights tailored to your child’s unique
          needs.
        </p>

        <div className="flex justify-center gap-6 mt-6 text-sm">
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
            🧠 AI-Powered Analysis
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            💬 Emotion Detection
          </span>
          <span className="flex items-center gap-1 text-pink-500 dark:text-pink-400 font-medium">
            ❤️ Personalized Care
          </span>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        className="mt-14 w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-2">
          Child Assessment Form
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          Please provide information about your child to receive personalized
          AI-powered recommendations and therapy suggestions.
        </p>

        {/* Error message display karein */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Child’s Name", name: "ChildName", type: "text", placeholder: "Enter child’s name" },
            { label: "Parents’s Name", name: "ParentsName", type: "text", placeholder: "Enter parents’s name" },
            { label: "Child’s Age", name: "age", type: "number", placeholder: "Enter age in years" },
          ].map((field, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition hover:shadow-sm"
                required
              />
            </motion.div>
          ))}

          {/* Dropdown fields */}
          {[
            { label: "Eye Contact", name: "eyeContact", options: ["Good", "Moderate", "Poor"] },
            { label: "Speech Level", name: "speechLevel", options: ["Normal", "Delayed", "Non-verbal"] },
            { label: "Social Response", name: "socialResponse", options: ["Interactive", "Limited", "Withdrawn"] },
            { label: "Sensory Reactions", name: "sensoryReactions", options: ["Normal", "Sensitive", "Extreme"] },
          ].map((dropdown, i) => (
            <motion.div key={i + 10} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">{dropdown.label}</label>
              <select
                name={dropdown.name}
                value={formData[dropdown.name]}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-400 outline-none transition hover:shadow-sm"
                required
              >
                <option value="">Select {dropdown.label.toLowerCase()}</option>
                {dropdown.options.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </motion.div>
          ))}

          {/* Photo Upload Section for Emotion Detection */}
          <motion.div
            className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center justify-center gap-2">
                <span className="text-2xl">📸</span>
                Optional: Upload Child's Photo for Emotion Analysis
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                {loadingModels ? "Loading AI models..." : "Get insights into emotional expressions"}
              </p>
            </div>

            {/* File Upload Button */}
            <div className="flex justify-center mb-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={!modelsLoaded}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-purple-600 dark:bg-purple-700 text-white rounded-xl font-semibold shadow-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  📁 Choose Photo
                </motion.div>
              </label>
            </div>

            {/* Image Preview and Analysis */}
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="relative mx-auto max-w-md">
                  <img
                    ref={imageRef}
                    src={imagePreview}
                    alt="Child"
                    className="w-full rounded-xl shadow-lg"
                    crossOrigin="anonymous"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                  />
                  {/* Remove Photo Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImage(null);
                      setEmotions(null);
                      setError(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
                    title="Remove photo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {!emotions && (
                  <button
                    type="button"
                    onClick={analyzeEmotions}
                    disabled={analyzingEmotion || !modelsLoaded}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {analyzingEmotion ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyzing Emotions...
                      </>
                    ) : (
                      <>🎭 Analyze Emotions</>
                    )}
                  </button>
                )}

                {/* Display Emotion Results */}
                {emotions && (
                  <div className="mt-6">
                    <div className="mb-3 p-3 bg-green-100 dark:bg-green-900 rounded-lg border border-green-300 dark:border-green-700">
                      <p className="text-green-800 dark:text-green-200 text-sm font-medium text-center">
                        ✅ Emotions analyzed successfully! You can now submit the form.
                      </p>
                    </div>
                    <EmotionChart emotions={emotions} />
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Animated Button - Loading state ke saath */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-teal-400 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "🚀 Analyze with AI"}
          </motion.button>
        </form>
      </motion.div>

      {/* Footer */}
      <footer className="mt-12 mb-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        Built with 💙 by{" "}
        <span className="text-blue-600 dark:text-blue-400 font-medium">Sandhya Singh</span> — Avni HealthTech Project
      </footer>
      </div>
    </div>
  );
};

export default AutismScreeningForm;