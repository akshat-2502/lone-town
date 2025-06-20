import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import MatchScreen from "./components/MatchScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import "./App.css";

const socket = io("http://localhost:5000");

const mockUsers = [
  {
    id: 1,
    conflictStyle: "Talk it out",
    personality: "Extrovert",
    relationshipGoal: "Long-term",
    affectionStyle: "Words",
    priority: "Trust",
  },
  {
    id: 2,
    conflictStyle: "Let emotions cool",
    personality: "Introvert",
    relationshipGoal: "Friendship",
    affectionStyle: "Time",
    priority: "Growth",
  },
  {
    id: 3,
    conflictStyle: "Take space then return",
    personality: "Ambivert",
    relationshipGoal: "Exploring",
    affectionStyle: "Touch",
    priority: "Fun",
  },
];

function App() {
  const [userState, setUserState] = useState("available");
  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [pinned, setPinned] = useState(true);
  const [frozenUntil, setFrozenUntil] = useState(null);
  const [freezeCountdown, setFreezeCountdown] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem("userProfile");
  });
  const [userProfile, setUserProfile] = useState(() => {
    const stored = localStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : null;
  });
  const [matchProfile, setMatchProfile] = useState(() => {
    const stored = localStorage.getItem("matchProfile");
    return stored ? JSON.parse(stored) : null;
  });
  const [compatibility, setCompatibility] = useState(() => {
    const stored = localStorage.getItem("compatibility");
    return stored ? parseInt(stored) : 0;
  });
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      setMessageCount((count) => count + 1);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (frozenUntil) {
      const interval = setInterval(() => {
        const now = new Date();
        const remaining = Math.max(
          0,
          Math.floor((new Date(frozenUntil) - now) / 1000)
        );
        setFreezeCountdown(remaining);

        if (remaining <= 0) {
          setUserState("available");
          setFrozenUntil(null);
          setPinned(true);
          setFreezeCountdown(null);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [frozenUntil]);

  const handleUnpin = () => {
    setPinned(false);
    setUserState("frozen");
    const freezeEnd = new Date(Date.now() + 10000);
    setFrozenUntil(freezeEnd);
  };

  const findBestMatch = (user, others) => {
    let bestMatch = null;
    let highestScore = -1;
    let bestScore = 0;

    others.forEach((candidate) => {
      let score = 0;
      for (const key of Object.keys(user)) {
        if (key !== "id" && candidate[key] && user[key] === candidate[key]) {
          score++;
        }
      }
      if (score > highestScore) {
        bestMatch = candidate;
        highestScore = score;
        bestScore = score;
      }
    });

    const percentage = Math.round((bestScore / 5) * 100);
    setCompatibility(percentage);
    localStorage.setItem("compatibility", percentage);
    return bestMatch;
  };

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
    localStorage.setItem("userProfile", JSON.stringify(profile));

    const matched = findBestMatch(profile, mockUsers);
    setMatchProfile(matched);
    localStorage.setItem("matchProfile", JSON.stringify(matched));

    setShowAnimation(true);

    const audio = new Audio("/match-sound.mp3");
    audio.play();

    setTimeout(() => {
      setShowOnboarding(false);
      setShowAnimation(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffe1e8] via-[#e8dcff] to-[#d3dafe] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-6 drop-shadow-md animate-pulse">
        💖 Lone Town
      </h1>
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-white bg-opacity-70 backdrop-blur-sm animate-fade-in">
          <div className="text-center animate-bounce">
            <h2 className="text-4xl font-bold text-pink-600 mb-2">
              ✨ Match Found! ✨
            </h2>
            <p className="text-lg text-indigo-700 font-medium">
              Get ready to start chatting...
            </p>
          </div>
        </div>
      )}
      {!showAnimation && showOnboarding ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        !showAnimation &&
        !showOnboarding && (
          <>
            <div className="w-full max-w-xl mb-4 bg-white shadow-md rounded-xl p-4">
              <h2 className="text-xl font-bold text-pink-600 mb-2">
                💘 You’ve been matched!
              </h2>
              {matchProfile && userProfile ? (
                <>
                  <div className="mb-2 text-center text-green-600 font-semibold text-sm">
                    💯 Compatibility Score: {compatibility}%
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className="text-indigo-700 font-bold text-md mb-1">
                        💁‍♂️ You
                      </h3>
                      <ul className="space-y-1">
                        <li>🧠 Conflict Style: {userProfile.conflictStyle}</li>
                        <li>🧬 Personality: {userProfile.personality}</li>
                        <li>🎯 Goal: {userProfile.relationshipGoal}</li>
                        <li>💌 Affection: {userProfile.affectionStyle}</li>
                        <li>💎 Priority: {userProfile.priority}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-pink-600 font-bold text-md mb-1">
                        💁‍♀️ Match
                      </h3>
                      <ul className="space-y-1">
                        <li>🧠 Conflict Style: {matchProfile.conflictStyle}</li>
                        <li>🧬 Personality: {matchProfile.personality}</li>
                        <li>🎯 Goal: {matchProfile.relationshipGoal}</li>
                        <li>💌 Affection: {matchProfile.affectionStyle}</li>
                        <li>💎 Priority: {matchProfile.priority}</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <p>No match found.</p>
              )}
            </div>
            <MatchScreen
              userState={userState}
              messages={messages}
              messageCount={messageCount}
              socket={socket}
              pinned={pinned}
              onUnpin={handleUnpin}
              freezeCountdown={freezeCountdown}
              matchProfile={matchProfile}
            />
          </>
        )
      )}
    </div>
  );
}

export default App;
