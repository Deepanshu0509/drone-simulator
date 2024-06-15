import React from 'react';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';

const SimulatePauseButton = ({ isSimulating, onStartSimulate, onPauseSimulate, currentTimeStep, handleSeekBarChange }) => {
  return (
    <div className="flex items-center bg-blue-500 text-white font-bold py-2 px-4 rounded flex-col justify-center mr-2">
      <button
        onClick={isSimulating ? onPauseSimulate : onStartSimulate}
        className="hover:bg-blue-600 p-1 rounded-full"
      >
        {isSimulating ? <IoPauseCircleOutline className="text-xl" /> : <IoPlayCircleOutline className="text-xl" />}
      </button>
      <input
        type="range"
        min={0}
        max={currentTimeStep.max-1}
        value={currentTimeStep.value}
        onChange={(e) => handleSeekBarChange(e.target.value)}
        className="w-24"
        
      />
      {/* {isSimulating ? ' Pause Simulation' : ' Start Simulation'} */}
    </div>
  );
};

export default SimulatePauseButton;
