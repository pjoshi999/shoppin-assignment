import { useState, useEffect } from "react";
import { SpeechService } from "../../services/SpeechServices";
import { useNavigate } from "react-router-dom";

interface VoiceRecorderProps {
  onClose: () => void;
  onResult: (text: string) => void;
}

const VoiceRecorder = ({ onClose, onResult }: VoiceRecorderProps) => {
  const [animationState, setAnimationState] = useState(0);
  const navigate = useNavigate();

  // Start listening when component mounts
  useEffect(() => {
    if (SpeechService.isSupported()) {
      SpeechService.start(
        (text) => {
          onResult(text);
        },
        (error) => {
          console.error("Speech recognition error:", error);
        }
      );
    }

    // Animation interval for the colored dots
    const animationInterval = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 4);
    }, 500);

    return () => {
      SpeechService.stop();
      clearInterval(animationInterval);
    };
  }, [onResult]);

  // Handle back button click
  const handleBack = () => {
    SpeechService.stop();
    onClose();
  };

  // Handle search a song click
  const handleSearchSong = () => {
    // Implement song search navigation
    navigate("/song-search");
  };

  return (
    <div>
      <div className="absolute top-0 left-0 inset-0 bg-[#1f2125] z-50">
        {/* Header with back button and globe icon */}
        <div className="w-full flex justify-between items-center p-4">
          <button onClick={handleBack} className="p-2">
            <svg
              className="w-6 h-6 text-gray-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <button className="p-2">
            <svg
              className="w-6 h-6 text-gray-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </button>
        </div>

        {/* Middle section with "Speak now" text */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-white text-2xl mb-16">Speak now</p>

          {/* Colored dots animation */}
          <div className="flex space-x-2 mt-4">
            <div
              className={`w-3 h-3 rounded-full ${
                animationState === 0
                  ? "bg-blue-500 scale-125"
                  : "bg-blue-500 opacity-70"
              } transition-all duration-300`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${
                animationState === 1
                  ? "bg-red-500 scale-125"
                  : "bg-red-500 opacity-70"
              } transition-all duration-300`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${
                animationState === 2
                  ? "bg-yellow-500 scale-125"
                  : "bg-yellow-500 opacity-70"
              } transition-all duration-300`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${
                animationState === 3
                  ? "bg-green-500 scale-125"
                  : "bg-green-500 opacity-70"
              } transition-all duration-300`}
            ></div>
          </div>
        </div>

        {/* Bottom section with "Search a song" button */}
        <div className="w-full p-8 flex justify-center">
          <button
            onClick={handleSearchSong}
            className="bg-gray-800 text-gray-300 rounded-full px-6 py-3 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            Search a song
          </button>
        </div>
      </div>

      {/* <VoiceRecorder
            onClose={() => setShowVoiceUI(false)}
            onResult={handleVoiceResult}
          /> */}
    </div>
  );
};

export default VoiceRecorder;
