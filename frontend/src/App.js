import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import DataVisualiser from './components/DataVisualiser/DataVisualiser.js';
const { abridgeData, quantiseData } = require('./processTubeData');

const dataBlockDuration = 30; // seconds between fetch from TFL

function App() {
  const [quantisedData, setQuantisedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lines = "bakerloo,central,circle,district,hammersmith-city,jubilee,metropolitan,northern,piccadilly,victoria,waterloo-city";
        const response = await axios.get(
          `https://api.tfl.gov.uk/Line/${lines}/Arrivals?`
        );
        const data = response.data;
        const filteredData = data
          .filter((item) => item.timeToStation < dataBlockDuration)
          .map((item) => ({
            id: item.id,
            stationName: item.stationName,
            lineName: item.lineName,
            timeToStation: item.timeToStation,
          }));
        const sortedData = filteredData.sort(
          (a, b) => a.timeToStation - b.timeToStation
        );
        const abridgedData = abridgeData(sortedData);
        const quantisedData = quantiseData(abridgedData);
        setQuantisedData(quantisedData);
        console.log(quantisedData);
      } catch (error) {
        console.error('Error fetching tube data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, dataBlockDuration * 1000);

    return () => {
      clearInterval(interval); // clear interval on component unmount
    };
  }, []); // Empty dependency array to run only once when the component is rendered

  return (
    <div className="App">
      <DataVisualiser data={quantisedData} />
    </div>
  );
}

export default App;
