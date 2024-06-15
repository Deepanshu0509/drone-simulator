import React, { useEffect, useState } from 'react';
import ReactMapGL, { Marker, NavigationControl, Source, Layer } from 'react-map-gl';
import SimulatePauseButton from './SimulatePauseButton';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent = ({ datasets }) => {
    const [viewState, setViewState] = useState({
    latitude: 51.5074,
    longitude: -0.1278    ,
    zoom: 10,
    width: '100%',
    height: '600px'
  });

  // State to manage all paths for each dataset
  const [paths, setPaths] = useState(datasets.map(() => []));
  // State to manage current positions of drones for each dataset
  const [currentPositions, setCurrentPositions] = useState(datasets.map(dataset => ({
    latitude: dataset.length > 0 ? dataset[0]?.latitude : 37.7749,
    longitude: dataset.length > 0 ? dataset[0]?.longitude : -122.4194
  })));
  // State to manage simulation state for each dataset
  const [isSimulating, setIsSimulating] = useState(datasets.map(() => false));
  // State to manage current indices for each dataset
  const [currentIndices, setCurrentIndices] = useState(datasets.map(() => 0));
  // State to manage interval IDs for each dataset
  const [intervalIds, setIntervalIds] = useState(datasets.map(() => null));
  // State to manage current time steps for each dataset
  const [currentTimeSteps, setCurrentTimeSteps] = useState(datasets.map(dataset => ({
    value: 0,  // Initial value of the slider
    max: dataset.length - 1  // Maximum value should be the length of the dataset
  })));

  const onStartSimulate = (index) => {
    setIsSimulating(prevState => prevState.map((state, i) => i === index ? true : state));
  };

  const onPauseSimulate = (index) => {
    setIsSimulating(prevState => prevState.map((state, i) => i === index ? false : state));
  };

  const simulateMovement = (index) => {
    if (intervalIds[index]) {
      clearInterval(intervalIds[index]);
    }

    const id = setInterval(() => {
      setCurrentIndices(prevIndices => {
        const newIndices = [...prevIndices];
        if (newIndices[index] < datasets[index].length) {
          const { latitude, longitude } = datasets[index][newIndices[index]];

          setPaths(prevPaths => {
            const newPaths = [...prevPaths];
            newPaths[index] = [...newPaths[index], [longitude, latitude]];
            return newPaths;
          });

          setCurrentPositions(prevPositions => {
            const newPositions = [...prevPositions];
            newPositions[index] = { latitude, longitude };
            return newPositions;
          });

          setCurrentTimeSteps(prevSteps => {
            const newSteps = [...prevSteps];
            newSteps[index] = { ...newSteps[index], value: newIndices[index] };
            return newSteps;
          });

          newIndices[index] += 1;
        } else {
          clearInterval(id);
          setIsSimulating(prevState => prevState.map((state, i) => i === index ? false : state));
        }
        return newIndices;
      });
    }, 1000);

    setIntervalIds(prevIds => {
      const newIds = [...prevIds];
      newIds[index] = id;
      return newIds;
    });
  };

  const handleSeekBarChange = (index, value) => {
    value = parseInt(value, 10); // Ensure value is parsed as integer

    setCurrentTimeSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[index] = { ...newSteps[index], value };
      return newSteps;
    });

    // Update currentIndices to the slider value
    setCurrentIndices(prevIndices => {
      const newIndices = [...prevIndices];
      newIndices[index] = value;
      return newIndices;
    });

    // Synchronize the current position and path with the selected time step
    if (value < datasets[index].length) {
      const { latitude, longitude } = datasets[index][value];
      setPaths(prevPaths => {
        const newPaths = [...prevPaths];
        newPaths[index] = [...newPaths[index], [longitude, latitude]];
        return newPaths;
      });
      setCurrentPositions(prevPositions => {
        const newPositions = [...prevPositions];
        newPositions[index] = { latitude, longitude };
        return newPositions;
      });
    }

    // Pause simulation when seeking manually
    setIsSimulating(prevState => prevState.map(() => false));
    intervalIds.forEach(id => clearInterval(id));
  };

  useEffect(() => {
    isSimulating.forEach((simulating, index) => {
      if (simulating) {
        simulateMovement(index);
      } else {
        clearInterval(intervalIds[index]);
      }
    });

    return () => {
      intervalIds.forEach(id => clearInterval(id));
    };
  }, [isSimulating, datasets, currentIndices]);

  return (
    <ReactMapGL
        {...viewState}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        style={{width: 1200, height: 600}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onMove={evt => setViewState(evt.viewState)}
        >  


        {datasets.map((dataset, index) => (
            <React.Fragment key={index}>
            {currentPositions[index] && (
                <Marker latitude={currentPositions[index].latitude} longitude={currentPositions[index].longitude}>
                    <div style={{ fontSize: '30px' }}>🛸</div>
                </Marker>
            )}

            <Source id={`dronePath-${index}`} type="geojson" data={{
                type: 'Feature',
                geometry: {
                type: 'LineString',
                coordinates: paths[index]
                }
            }}>
                <Layer
                id={`dronePath-${index}`}
                type="line"
                source={`dronePath-${index}`}
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

            <div style={{ position: 'absolute', left: 10, top: 70 * index + 10 }}>
              <SimulatePauseButton
                isSimulating={isSimulating[index]}
                onStartSimulate={() => onStartSimulate(index)}
                onPauseSimulate={() => onPauseSimulate(index)}
                currentTimeStep={currentTimeSteps[index]}
                handleSeekBarChange={(value) => handleSeekBarChange(index, value)}
              />
            </div>
            </React.Fragment>
        ))}

      <div style={{ position: 'absolute', right: 10, top: 50 }}>
        <NavigationControl />
      </div>
    </ReactMapGL>
  );
};

export default MapComponent;
