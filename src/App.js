import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CSVInput from './components/CSVInput';
import MapComponent from './components/MapComponent';

const App = () => {
  const [data, setData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const onStartSimulate = () => {
    setIsSimulating(true);
  };

  const onPauseSimulate = () => {
    setIsSimulating(false);
  };
  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
      <div className="flex justify-center items-center pt-8">
        {data.length === 0 ? (
          <CSVInput setData={setData} />
        ) : (
          <MapComponent
            data={data}
            isSimulating={isSimulating}
            onStartSimulate={onStartSimulate}
            onPauseSimulate={onPauseSimulate}
          />
        )}
      </div>
    </div>
  );
};

export default App;
