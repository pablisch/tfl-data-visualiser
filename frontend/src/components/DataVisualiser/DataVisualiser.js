import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const DataVisualiser = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const labels = [];
    const lineNames = [];
    const intervals = {};

    // Extract data for chart
    data.forEach((item) => {
      const { lineName, timeToStation } = item;

      if (!lineNames.includes(lineName)) {
        lineNames.push(lineName);
      }

      if (!labels.includes(timeToStation)) {
        labels.push(timeToStation);
      }

      if (!intervals[lineName]) {
        intervals[lineName] = {};
      }

      if (!intervals[lineName][timeToStation]) {
        intervals[lineName][timeToStation] = 0;
      }

      intervals[lineName][timeToStation]++;
    });

    // Create chart
    const chartData = {
      labels,
      datasets: lineNames.map((lineName) => ({
        label: lineName,
        data: labels.map((timeToStation) =>
          intervals[lineName][timeToStation] || 0
        ),
        backgroundColor: getRandomColor(),
        borderWidth: 1,
      })),
    };

    const chartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time to Station',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Count',
          },
        },
      },
    };

    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });
  }, [data]);

  // Helper function to generate random colors
  const getRandomColor = () =>
    `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.7)`;

  return <canvas ref={chartRef} />;
};

export default DataVisualiser;
