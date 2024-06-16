import React, { useState } from 'react';
import Papa from 'papaparse';
import { Tooltip } from 'react-tooltip';

const CSVInput = ({ addDataset }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    // Filter out non-CSV files
    const csvFiles = selectedFiles.filter(file => file.type === 'text/csv');

    // Clear previous errors
    setErrors([]);

    // Update state with selected CSV files
    setFiles(csvFiles);
  };

  const handleUpload = () => {
    // Reset errors
    setErrors([]);

    // Process each selected file
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;

        // Parse CSV data using PapaParse
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const headers = result.meta.fields;
            const requiredColumns = ['timestamp', 'latitude', 'longitude'];
            const missingColumns = requiredColumns.filter(column => !headers.includes(column));

            if (missingColumns.length > 0) {
              setErrors(prevErrors => [...prevErrors, `File ${file.name}: Missing required columns: ${missingColumns.join(', ')}`]);
            } else {
              const parsedData = result.data.map(row => ({
                timestamp: row.timestamp,
                latitude: parseFloat(row.latitude),
                longitude: parseFloat(row.longitude)
              }));

              // Add new dataset to parent component using addDataset prop
              addDataset(parsedData);
            }
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setErrors(prevErrors => [...prevErrors, `Error parsing ${file.name}: ${error.message}`]);
          }
        });
      };

      // Read the file as text
      reader.readAsText(file);
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md relative">
      <div className="flex items-center mb-4">
        <input
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded-md"
        />
        <div className="ml-2 relative flex items-center">
          <span
            data-tooltip-id="upload-tooltip"
            className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600"
          >
            i
          </span>
          <Tooltip 
            id="upload-tooltip" 
            place="right" 
            type="dark" 
            effect="solid" 
            delayHide={500} 
            delayUpdate={500} 
            clickable
          >
            <p>Upload any number of CSV files to simulate your drone trajectory. </p><p> The CSV file should have <b>timestamp</b>, <b>latitude</b>, and <b>longitude</b> as columns.</p>
              <p>You can use the below files to get started</p>
              <ul>
                <li><a href="/D.csv" download className="text-blue-400 underline">D-letter.csv</a></li>
                <li><a href="/K.csv" download className="text-blue-400 underline">K-letter.csv</a></li>
              </ul>
          </ Tooltip>
        </div>
      </div>
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Upload
      </button>
      {errors.length > 0 && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded-md">
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CSVInput;
