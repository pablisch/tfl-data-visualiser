import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import './DataVisualiser.css'

const DataVisualiser = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;

    const createChart = () => {
      const labels = [];
      const lineNames = [];
      const intervals = {};

      const colorMap = {
        Bakerloo: 'rgba(139, 69, 19, 0.7)', // Brown color for Bakerloo
        Central: 'rgba(220, 36, 31, 0.7)',
        Circle: 'rgba(255, 206, 67, 0.7)',
        District: 'rgba(0, 125, 50, 0.7)',
        'Hammersmith&City': 'rgba(255, 105, 180, 0.7)', // Pink color with opacity for Hammersmith & City
        Jubilee: 'rgba(190, 190, 190, 0.7)', // Light grey/silver color with opacity for Jubilee
        Metropolitan: 'rgba(155, 52, 102, 0.7)',
        Northern: 'rgba(0, 0, 0, 0.7)',
        Piccadilly: 'rgba(0, 25, 168, 0.7)',
        Victoria: 'rgba(0, 152, 216, 0.7)',
        'Waterloo&City': 'rgba(82, 179, 217, 0.7)',
      };

      // Extract data for chart
      data.forEach((item) => {
        const { lineName, timeToStation } = item;

        if (!lineNames.includes(lineName)) {
          lineNames.push(lineName);
        }

        const timeInSeconds = Math.floor(timeToStation);

        if (!labels.includes(timeInSeconds)) {
          labels.push(timeInSeconds);
        }

        if (!intervals[lineName]) {
          intervals[lineName] = {};
        }

        if (!intervals[lineName][timeInSeconds]) {
          intervals[lineName][timeInSeconds] = 0;
        }

        intervals[lineName][timeInSeconds]++;
      });

      // Create chart
      const chartData = {
        labels,
        datasets: lineNames.map((lineName) => ({
          label: lineName,
          data: labels.map(
            (timeInSeconds) => intervals[lineName][timeInSeconds] || 0
          ),
          backgroundColor: colorMap[lineName], // Use the assigned color for the lineName
          borderWidth: 1,
        })),
      };

      const chartOptions = {
        indexAxis: 'x',
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time (seconds)',
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

      // Destroy the previous chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create a new chart instance
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions,
      });
    };

    createChart();

    // Cleanup function
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data]);

  return <canvas id='data-chart' ref={chartRef} />;
};

export default DataVisualiser;
