import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SpeechService from "../../services/SpeechServices";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showVoiceUI, setShowVoiceUI] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [animationState, setAnimationState] = useState(0);
  const navigate = useNavigate();

  const handleSearchSubmit = useCallback(
    (query: string = searchTerm) => {
      if (!query.trim()) return;
      window.location.href = `https://www.google.co.in/search?q=${encodeURIComponent(
        query
      )}`;
    },
    [searchTerm]
  );

  const handleVoiceResult = useCallback(
    (text: string) => {
      setSearchTerm(text);
      setShowVoiceUI(false);
      // Auto submit after voice input
      setTimeout(() => handleSearchSubmit(text), 500);
    },
    [handleSearchSubmit]
  );

  useEffect(() => {
    if (showVoiceUI && SpeechService.isSupported()) {
      SpeechService.start(
        (text) => {
          handleVoiceResult(text);
        },
        (error) => {
          console.error("Speech recognition error:", error);
        }
      );

      const animationInterval = setInterval(() => {
        setAnimationState((prev) => (prev + 1) % 4);
      }, 500);

      return () => {
        SpeechService.stop();
        clearInterval(animationInterval);
      };
    }
  }, [showVoiceUI, handleVoiceResult]);

  const handleBack = () => {
    SpeechService.stop();
    setShowVoiceUI(false);
  };

  const recentSearches = [
    "sleeveless gilet jacket men india",
    "sequins skirt less than 2000",
    "cut out bodysuit india",
    "floral crop top",
    "black leather skirt with button",
    "neon shirt",
    "oversized women's leather jacket india",
  ];

  const getSearchRecommendations = (input: string) => {
    if (!input) return [];

    return [
      `${input} online shopping`,
      `${input} near me`,
      `${input} best brands`,
      `${input} price in india`,
      `${input} review`,
    ];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (term: string) => {
    setSearchTerm(term);
    handleSearchSubmit(term);
  };

  const handleMicClick = () => {
    setShowVoiceUI(true);
  };

  const handleCameraClick = () => {
    console.log("Camera clicked");
    navigate("/lens");
  };

  return (
    <>
      {showVoiceUI && (
        <div className="">
          <div className="absolute top-0 left-0 bg-[#2e3133] z-50 w-screen h-screen overflow-hidden">
            <div className="w-full h-[10vh] flex justify-between items-center p-4">
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

            <div className="flex-1 flex flex-col items-center justify-center gap-10 h-[70vh]">
              <p className="text-[#a0a3a5] text-[22px] pb-72 text-center absolute">
                Speak now
              </p>

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

            <div className="w-full p-8 flex justify-center">
              <button className="bg-[#202226] text-[#999ca0] rounded-full px-3 py-2 flex items-center border border-[#4f5256] text-sm">
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
        </div>
      )}

      {isFocused && !showVoiceUI && (
        <div className="h-screen w-screen bg-[#1f2125] absolute top-0 left-0 z-30 px-3 py-4">
          <div className="flex items-center bg-[#2e3133] rounded-full px-4 py-3 mb-2 relative">
            <svg
              className="w-6 h-6 text-[#9ea1a5] cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => setIsFocused(false)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>

            <input
              ref={inputRef}
              className="bg-[#2e3133] text-gray-100 text-base w-full outline-none border-none px-2"
              placeholder="Search or type URL"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit(searchTerm);
                }
              }}
              autoFocus
            />

            <div className="flex items-center space-x-4 bg-[#2e3133]">
              <svg
                className="w-6 h-6 text-gray-100 cursor-pointer"
                viewBox="0 0 24 24"
                onClick={handleMicClick}
              >
                <path
                  fill="currentColor"
                  d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"
                />
                <path fill="currentColor" d="m11 18.08h2v3.92h-2z" />
                <path
                  fill="currentColor"
                  d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"
                />
                <path
                  fill="currentColor"
                  d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"
                />
              </svg>

              <svg
                className="w-6 h-6 text-gray-100 cursor-pointer"
                viewBox="0 0 192 192"
                onClick={handleCameraClick}
              >
                <rect fill="none" height="192" width="192" />
                <g>
                  <circle fill="currentColor" cx="144.07" cy="144" r="16" />
                  <circle fill="currentColor" cx="96.07" cy="104" r="24" />
                  <path
                    fill="currentColor"
                    d="M24,135.2c0,18.11,14.69,32.8,32.8,32.8H96v-16l-40.1-0.1c-8.8,0-15.9-8.19-15.9-17.9v-18H24V135.2z"
                  />
                  <path
                    fill="currentColor"
                    d="M168,72.8c0-18.11-14.69-32.8-32.8-32.8H116l20,16c8.8,0,16,8.29,16,18v30h16V72.8z"
                  />
                  <path
                    fill="currentColor"
                    d="M112,24l-32,0L68,40H56.8C38.69,40,24,54.69,24,72.8V92h16V74c0-9.71,7.2-18,16-18h80L112,24z"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div
            ref={dropdownRef}
            className="bg-[#1f2125] rounded-b-xl shadow-lg mt-0 z-50 max-w-md mx-auto"
          >
            <div className="flex justify-between items-center px-4 py-2 text-[#9ea1a5] text-sm">
              <span className="">Recent searches</span>
              <span className="text-xs cursor-pointer">MANAGE HISTORY</span>
            </div>

            <div className="py-2">
              {searchTerm
                ? getSearchRecommendations(searchTerm).map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleItemClick(recommendation)}
                      >
                        <div className="mr-3 text-[#9ea1a5]">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M19.7 17.6l-2.1-2.1c.8-1.2 1.3-2.7 1.3-4.2 0-4.1-3.3-7.4-7.4-7.4C7.3 3.9 4 7.3 4 11.4c0 4.1 3.3 7.4 7.4 7.4 1.6 0 3-.5 4.2-1.3l2.1 2.1c.6.6 1.5.6 2.1 0s.5-1.5 0-2ZM11.4 7c2.5 0 4.5 2 4.5 4.5S13.9 16 11.4 16s-4.5-2-4.5-4.5 2-4.5 4.5-4.5Z" />
                          </svg>
                        </div>
                        <span className="text-[#dddee2]">{recommendation}</span>
                      </div>
                    )
                  )
                : // Show recent searches
                  recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleItemClick(search)}
                    >
                      <div className="mr-3 text-[#9ea1a5]">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                        </svg>
                      </div>
                      <span className="text-[#dddee2]">{search}</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
      <div className="w-full lg:max-w-xl max-w-md mx-auto">
        <div className="flex items-center lg:bg-[#3f4454] bg-[#2e3133] rounded-full px-4 py-3 mb-2 relative">
          <input
            ref={inputRef}
            className="lg:bg-[#3f4454] bg-[#2e3133] text-gray-100 text-base w-full outline-none border-none px-2"
            placeholder="Search or type URL"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit(searchTerm);
              }
            }}
          />

          <div className="flex items-center space-x-4">
            <svg
              className="w-6 h-6 text-gray-100 cursor-pointer"
              viewBox="0 0 24 24"
              onClick={handleMicClick}
            >
              <path
                fill="currentColor"
                d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"
              />
              <path fill="currentColor" d="m11 18.08h2v3.92h-2z" />
              <path
                fill="currentColor"
                d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"
              />
              <path
                fill="currentColor"
                d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"
              />
            </svg>
            <svg
              className="w-6 h-6 text-gray-100 cursor-pointer"
              viewBox="0 0 192 192"
              onClick={handleCameraClick}
            >
              <rect fill="none" height="192" width="192" />
              <g>
                <circle fill="currentColor" cx="144.07" cy="144" r="16" />
                <circle fill="currentColor" cx="96.07" cy="104" r="24" />
                <path
                  fill="currentColor"
                  d="M24,135.2c0,18.11,14.69,32.8,32.8,32.8H96v-16l-40.1-0.1c-8.8,0-15.9-8.19-15.9-17.9v-18H24V135.2z"
                />
                <path
                  fill="currentColor"
                  d="M168,72.8c0-18.11-14.69-32.8-32.8-32.8H116l20,16c8.8,0,16,8.29,16,18v30h16V72.8z"
                />
                <path
                  fill="currentColor"
                  d="M112,24l-32,0L68,40H56.8C38.69,40,24,54.69,24,72.8V92h16V74c0-9.71,7.2-18,16-18h80L112,24z"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
