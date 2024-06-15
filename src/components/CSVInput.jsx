import React, { useState } from 'react';
import Papa from 'papaparse';

const CSVInput = ({ setData }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null); // Clear previous errors
    } else {
      alert('Please select a CSV file');
    }
  };

  const handleUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const headers = result.meta.fields;
          const requiredColumns = ['timestamp', 'latitude', 'longitude'];
          const missingColumns = requiredColumns.filter(column => !headers.includes(column));

          if (missingColumns.length > 0) {
            setError(`Missing required columns: ${missingColumns.join(', ')}`);
            setData([]);
          } else {
            const parsedData = result.data.map(row => ({
              timestamp: row.timestamp,
              latitude: parseFloat(row.latitude),
              longitude: parseFloat(row.longitude)
            }));
            setData(parsedData);
            setError(null); // Clear any previous errors
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setError('Error parsing CSV file.');
        }
      });
    } else {
      alert('No file selected');
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Upload
      </button>
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default CSVInput;
