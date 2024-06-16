import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import CSVInput from "./components/CSVInput";
import MapComponent from "./components/MapComponent";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from './components/Footer';

const App = () => {
  const [datasets, setDatasets] = useState([]);

  const addDataset = (newDataset) => {
    setDatasets((prevDatasets) => [...prevDatasets, newDataset]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-200 flex flex-col">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col items-center h-full">
                {datasets.length === 0 ? (
                  <CSVInput addDataset={addDataset} />
                ) : (
                  <MapComponent datasets={datasets} />
                )}
              </div>
            }
          />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div> 
    </Router>
  );
};

export default App;
