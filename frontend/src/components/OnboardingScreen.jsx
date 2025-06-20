import React, { useState } from "react";

const questions = [
  {
    label: "How do you usually handle conflicts in a relationship?",
    name: "conflictStyle",
    options: [
      "Talk it out",
      "Take space then return",
      "Avoid entirely",
      "Let emotions cool",
    ],
  },
  {
    label: "Which best describes your personality?",
    name: "personality",
    options: ["Introvert", "Extrovert", "Ambivert"],
  },
  {
    label: "What's your relationship goal?",
    name: "relationshipGoal",
    options: ["Long-term", "Short-term", "Friendship", "Exploring"],
  },
  {
    label: "How do you express affection?",
    name: "affectionStyle",
    options: ["Words", "Time", "Touch", "Gifts"],
  },
  {
    label: "What matters most in a partner?",
    name: "priority",
    options: ["Trust", "Fun", "Stability", "Growth"],
  },
];

const OnboardingScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleChange = (option) => {
    setFormData({ ...formData, [questions[step].name]: option });
  };

  const next = () => {
    if (step === questions.length - 1) {
      onComplete(formData);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
        Let's Get to Know You 💫
      </h2>
      <p className="text-md text-gray-700 font-medium mb-4">
        {questions[step].label}
      </p>
      <div className="grid grid-cols-1 gap-3">
        {questions[step].options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleChange(option)}
            className={`border rounded-full px-4 py-2 transition font-medium ${
              formData[questions[step].name] === option
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={next}
        disabled={!formData[questions[step].name]}
        className="mt-6 bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 disabled:opacity-50"
      >
        {step === questions.length - 1 ? "Finish" : "Next"} ➡️
      </button>
      <div className="mt-4 text-xs text-gray-500">
        Question {step + 1} of {questions.length}
      </div>
    </div>
  );
};

export default OnboardingScreen;
