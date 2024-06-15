import React, { useEffect, useState } from 'react';
import ReactMapGL, { Marker, NavigationControl, Source, Layer } from 'react-map-gl';
import SimulatePauseButton from './SimulatePauseButton';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent = ({ data }) => {
    const [viewState, setViewState] = useState({
    latitude: data.length > 0 ? data[0].latitude : 37.7749, // Default to San Francisco coordinates if data is empty
    longitude: data.length > 0 ? data[0].longitude : -122.4194,
    zoom: 15,
    width: '100%',
    height: '600px'
  });

  const [path, setPath] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(data.length > 0 ? { latitude: data[0]?.latitude, longitude: data[0]?.longitude } : null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (isSimulating) {
      if (intervalId) {
        clearInterval(intervalId); // Clear previous interval if exists
      }
      
      const id = setInterval(() => {
        if (currentIndex < data.length) {
          const { latitude, longitude } = data[currentIndex];
          setPath(prevPath => [...prevPath, [longitude, latitude]]);
          setCurrentPosition({ latitude, longitude });
          setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
          clearInterval(id);
          setIsSimulating(false);
        }
      }, 1000);

      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isSimulating, data, currentIndex]);

  const onStartSimulate = () => {
    setIsSimulating(true);
  };

  const onPauseSimulate = () => {
    setIsSimulating(false);
  };
  
  return (
    <ReactMapGL
        {...viewState}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        style={{width: 1200, height: 600}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onMove={evt => setViewState(evt.viewState)}
        >  

        {currentPosition && (
            <Marker latitude={currentPosition.latitude} longitude={currentPosition.longitude}>
            <div style={{ fontSize: '30px' }}>🛸</div>
            </Marker>
        )} 

      <Source id="dronePath" type="geojson" data={{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: path
        }
      }}>
        <Layer
          id="dronePath"
          type="line"
          source="dronePath"
          layout={{
            'line-join': 'round',
            'line-cap': 'round'
          }}
          paint={{
            'line-color': '#0096FF',
            'line-width': 5
          }}
        />
      </Source>

      <div style={{ position: 'absolute', left: 10, top: 10 }}>
        <SimulatePauseButton
          isSimulating={isSimulating}
          onStartSimulate={onStartSimulate}
          onPauseSimulate={onPauseSimulate}
        />
      </div>

      <div style={{ position: 'absolute', right: 10, top: 50 }}>
        <NavigationControl />
      </div>
    </ReactMapGL>
  );
};

export default MapComponent;
