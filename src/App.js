import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import Papa from 'papaparse';
import Data from './data.csv';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
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

      // Filter data for the specified date range (1 July 2015 to 3 July 2015)
      const startDate = new Date('2015-07-01');
      const endDate = new Date('2015-07-03');
      console.log('Start date:', startDate);
console.log('End date:', endDate);
      const filteredData = parsedData.filter(item => {
        const monthNumber = monthNames.indexOf(item.arrival_date_month);
        const currentDate = new Date(item.arrival_date_year, monthNumber, parseInt(item.arrival_date_day_of_month));
        
        // Log the date values
        console.log('Year:', item.arrival_date_year);
        console.log('Month:', item.arrival_date_month);
        console.log('Day:', item.arrival_date_day_of_month);
        console.log('Parsed date:', currentDate);
      
        return currentDate >= startDate && currentDate <= endDate;
      });
      setData(filteredData);
    };
    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount


  function dateIsValid(date) {
    return !Number.isNaN(date.getTime());
  }
  // Calculate total number of visitors per day
  const visitorsPerDay = {};
  data.forEach(item => {
    const currentDate = new Date(item.arrival_date_year, item.arrival_date_month - 1, item.arrival_date_day_of_month);
    if (dateIsValid(currentDate)) {
      const dateString = currentDate.toISOString().split('T')[0];
      const totalVisitors = parseInt(item.adults) + parseInt(item.children) + parseInt(item.babies);
      visitorsPerDay[dateString] = (visitorsPerDay[dateString] || 0) + totalVisitors;
    } else {
      console.warn('Invalid date:', item);
    }
  });
  

  // Calculate total number of visitors per country
  const visitorsPerCountry = {};
  data.forEach(item => {
    const country = item.country;
    const totalVisitors = parseInt(item.adults) + parseInt(item.children) + parseInt(item.babies);
    visitorsPerCountry[country] = (visitorsPerCountry[country] || 0) + totalVisitors;
  });

  // Calculate total number of adult visitors
  const totalAdultVisitors = data.reduce((acc, item) => acc + parseInt(item.adults), 0);

  // Calculate total number of children visitors
  const totalChildrenVisitors = data.reduce((acc, item) => acc + parseInt(item.children), 0);

  // Chart options
  const timeSeriesOptions = {
    series: [{
      name: 'Number of Visitors',
      data: Object.entries(visitorsPerDay).map(([date, visitors]) => ({ x: date, y: visitors })),
    }],
    options: {
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
        text: 'Number of Visitors per Day',
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
    },
  };

  const columnChartOptions = {
    series: [{
      name: 'Number of Visitors',
      data: Object.entries(visitorsPerCountry).map(([country, visitors]) => ({ x: country, y: visitors })),
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"],
        },
      },
      xaxis: {
        categories: Object.keys(visitorsPerCountry),
        position: 'top',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val;
          },
        },
      },
      title: {
        text: 'Number of Visitors per Country',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444',
        },
      },
    },
  };

  const sparklineOptions1 = {
    series: [{
      data: [totalAdultVisitors],
    }],
    options: {
      chart: {
        type: 'area',
        height: 160,
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: 'straight',
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0,
      },
      colors: ['#DCE6EC'],
      title: {
        text: `${totalAdultVisitors}`,
        offsetX: 0,
        style: {
          fontSize: '24px',
        },
      },
      subtitle: {
        text: 'Total Adult Visitors',
        offsetX: 0,
        style: {
          fontSize: '14px',
        },
      },
    },
  };

  const sparklineOptions2 = {
    series: [{
      data: [totalChildrenVisitors],
    }],
    options: {
      chart: {
        type: 'area',
        height: 160,
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: 'straight',
      },
      fill: {
        opacity: 0.3,
      },
      yaxis: {
        min: 0,
      },
      colors: ['#DCE6EC'],
      title: {
        text: `${totalChildrenVisitors}`,
        offsetX: 0,
        style: {
          fontSize: '24px',
        },
      },
      subtitle: {
        text: 'Total Children Visitors',
        offsetX: 0,
        style: {
          fontSize: '14px',
        },
      },
    },
  };
  console.log('visitorsPerDay:', visitorsPerDay);
  console.log('visitorsPerCountry:', visitorsPerCountry);
  console.log('totalAdultVisitors:', totalAdultVisitors);
  console.log('totalChildrenVisitors:', totalChildrenVisitors);
  return (
    <div>
      <h2>Charts</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div style={chartContainerStyle}>
          <ApexCharts options={timeSeriesOptions.options} series={timeSeriesOptions.series} type="area" height={350} />
        </div>

        <div style={chartContainerStyle}>
          <ApexCharts options={columnChartOptions.options} series={columnChartOptions.series} type="bar" height={350} />
        </div>

        <div style={chartContainerStyle}>
          <ApexCharts options={sparklineOptions1.options} series={sparklineOptions1.series} type="area" height={160} />
        </div>

        <div style={chartContainerStyle}>
          <ApexCharts options={sparklineOptions2.options} series={sparklineOptions2.series} type="area" height={160} />
        </div>
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
