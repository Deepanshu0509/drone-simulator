import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CSVInput from './components/CSVInput';
import MapComponent from './components/MapComponent';

const App = () => {
  const [datasets, setDatasets] = useState([]);

  const addDataset = (newDataset) => {
    setDatasets(prevDatasets => [...prevDatasets, newDataset]);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
      <div className="flex flex-col items-center pt-8">
        {datasets.length === 0 ? (
          <CSVInput addDataset={addDataset} />
        ) : (
          <MapComponent datasets={datasets} />
        )}
      </div>
    </div>
  );
};

export default App;
