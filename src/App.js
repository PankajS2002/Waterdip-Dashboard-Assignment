import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import Data from './data.csv';
import ApexCharts from 'apexcharts';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

const App = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chart, setChart] = useState(null);
  const chart1Ref = useRef(null);

  const fetchData = async () => {
    const response = await fetch(Data);
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csvData = decoder.decode(result.value);
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    }).data;
  
    const monthMapping = {
      'January': '01',
      'February': '02',
      'March': '03',
      'April': '04',
      'May': '05',
      'June': '06',
      'July': '07',
      'August': '08',
      'September': '09',
      'October': '10',
      'November': '11',
      'December': '12'
    };
  
    const visitorsPerDay = new Map();
  
    parsedData.forEach(item => {
      const dateStr = `${item.arrival_date_year}-${monthMapping[item.arrival_date_month]}-${item.arrival_date_day_of_month}`;
      console.log(dateStr);
      const totalVisitors = parseInt(item.adults, 10) + parseInt(item.children, 10) + parseInt(item.babies, 10);
  
      if (visitorsPerDay.has(dateStr)) {
        visitorsPerDay.set(dateStr, visitorsPerDay.get(dateStr) + totalVisitors);
      } else {
        visitorsPerDay.set(dateStr, totalVisitors);
      }
    });
  
    const offsetIST = 5.5 * 60 * 60 * 1000; // Offset for IST timezone (5 hours and 30 minutes)
    const chartData = Array.from(visitorsPerDay, ([dateStr, visitors]) => ({ date: new Date(dateStr).getTime() + offsetIST, visitors }));

  
    setData(chartData);
    setAllData(chartData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateChartData = (data, startDate, endDate) => {
    return data.filter(item => item.date >= startDate && item.date <= endDate)
               .map(item => [item.date, item.visitors]);
  };

  useEffect(() => {
    const options = {
      series: [{
        name: 'Visitors',
        data: generateChartData(data, startDate, endDate),
      }],
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: 'zoom',
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: 'Visitors',
        align: 'left',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (val).toFixed(0);
          },
        },
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return val.toFixed(0);
          },
        },
      },
    };

    const chartInstance = new ApexCharts(chart1Ref.current, options);
    chartInstance.render();
    setChart(chartInstance);

    return () => {
      chartInstance.destroy();
    };
  }, []);

  useEffect(() => {
    if (chart) {
      const newSeries = [{
        name: 'Visitors',
        data: generateChartData(allData, startDate, endDate)
      }];
      chart.updateSeries(newSeries);
    }
  }, [startDate, endDate, allData, chart]);

  const handleSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
  }

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  }

  return (
    <div>
      <h2>Charts</h2>
      <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div ref={chart1Ref} style={chartContainerStyle}></div>
      </div>
    </div>
  );
};

const chartContainerStyle = {
  width: '45%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '20px',
};

export default App;

