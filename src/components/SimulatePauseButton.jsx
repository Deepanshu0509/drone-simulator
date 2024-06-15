import React from 'react';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';

const SimulatePauseButton = ({ isSimulating, onStartSimulate, onPauseSimulate }) => {
  return (
    <button onClick={isSimulating ? onPauseSimulate : onStartSimulate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex flex-col items-center justify-center">
      {isSimulating ? <IoPauseCircleOutline className="text-xl" /> : <IoPlayCircleOutline className="text-xl" />}
      {isSimulating ? ' Pause Simulation' : ' Start Simulation'}
    </button>
  );
};

export default SimulatePauseButton;
