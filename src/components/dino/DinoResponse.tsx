import React from "react";

interface DinoResponseProps {
  isLoading: boolean; // Indicates whether the AI is preparing a response
}

const DinoResponse: React.FC<DinoResponseProps> = ({ isLoading }) => {
  return (
    <div className="flex flex-row items-center text-center gap-2">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center">
        <img src="src/assets/rex_magnified.png" alt="AI Avatar" />
      </div>

      {/* AI Name and Loading State */}
      <div className="text-base text-white mt-1">
        <span className="font-semibold">DinoMind</span>
        {isLoading && (
          <span className="ml-2 animate-pulse text-gray-300">
            is preparing a response...
          </span>
        )}
      </div>
    </div>
  );
};

export default DinoResponse;
