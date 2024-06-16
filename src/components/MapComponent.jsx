import React, { useEffect, useState } from 'react';
import ReactMapGL, { Marker, NavigationControl, Source, Layer } from 'react-map-gl';
import SimulatePauseButton from './SimulatePauseButton';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent = ({ datasets }) => {
    const initialLatitude = datasets.length > 0 && datasets[0].length > 0 ? datasets[0][0].latitude : 26.4779;
    const initialLongitude = datasets.length > 0 && datasets[0].length > 0 ? datasets[0][0].longitude : 73.1165;
    const [viewState, setViewState] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
    zoom: 10,
    width: '100%',
    height: '600px'
  });

  const [paths, setPaths] = useState(datasets.map(() => []));
  const [currentPositions, setCurrentPositions] = useState(datasets.map(dataset => ({
    latitude: dataset.length > 0 ? dataset[0]?.latitude : 37.7749,
    longitude: dataset.length > 0 ? dataset[0]?.longitude : -122.4194
  })));
  const [isSimulating, setIsSimulating] = useState(datasets.map(() => false));
  const [currentIndices, setCurrentIndices] = useState(datasets.map(() => 0));
  const [intervalIds, setIntervalIds] = useState(datasets.map(() => null));
  const [currentTimeSteps, setCurrentTimeSteps] = useState(datasets.map(dataset => ({
    value: 0, 
    max: dataset.length
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
    value = parseInt(value, 10); 

    setCurrentTimeSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[index] = { ...newSteps[index], value };
      return newSteps;
    });

    setCurrentIndices(prevIndices => {
      const newIndices = [...prevIndices];
      newIndices[index] = value;
      return newIndices;
    });

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
    <div className="w-[100vw] h-[90vh]">
    <ReactMapGL
        {...viewState}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onMove={evt => setViewState(evt.viewState)}
        >  


        {datasets.map((dataset, index) => (
            <React.Fragment key={index}>
            {currentPositions[index] && (
                <Marker latitude={currentPositions[index].latitude} longitude={currentPositions[index].longitude}>
                    <div className='flex flex-col justify-center items-center'>
                      <div className='text-violet-700 font-bold -mb-2 text-xl'>Drone {index + 1}</div>
                      <div className='text-3xl'>🛸</div>
                    </div>
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
                    'line-width': 3
                }}
                />
            </Source>

            <div style={{ position: 'absolute', left: 10, top: 70 * index + 10 }}>
              <SimulatePauseButton
                isSimulating={isSimulating[index]}
                onStartSimulate={() => onStartSimulate(index)}
                onPauseSimulate={() => onPauseSimulate(index)}
                currentTimeStep={currentTimeSteps[index] || { value: 0, max: dataset.length }}
                handleSeekBarChange={(value) => handleSeekBarChange(index, value)}
                index={index}
              />
            </div>
            </React.Fragment>
        ))}

      <div style={{ position: 'absolute', right: 10, top: 50 }}>
        <NavigationControl />
      </div>
    </ReactMapGL>
    </div>
  );
};

export default MapComponent;
