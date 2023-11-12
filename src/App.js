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
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  const chart4Ref = useRef(null);

  useEffect(() => {
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

      // Convert date strings to Date objects
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
      parsedData.forEach(item => {
        const dateStr = `${item.arrival_date_year}-${monthMapping[item.arrival_date_month]}-${item.arrival_date_day_of_month}`;
        item.date = new Date(dateStr);
      });

      setData(parsedData);
      setAllData(parsedData);
    };
    fetchData();
  }, []);

  const generateData = () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');
    const dateArray = [];
    const priceArray = [];

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      dateArray.push(new Date(date));
      priceArray.push(Math.random() * 1000000);
    }

    const timestamps = dateArray.map(date => date.getTime());

    const data = timestamps.map((timestamp, index) => [timestamp, priceArray[index]]);

    return data;
  };

  const dates = generateData();
 useEffect(() => {
  const options = {
    series: [{
      name: 'XYZ MOTORS',
      data: dates,
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
      text: 'Stock Price Movement',
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

  const options2 = {
    series: [{
      name: 'Inflation',
      data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
    }],
    chart: {
      height: 350,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      }
    },

    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      position: 'top',
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
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
          }
        }
      },
      tooltip: {
        enabled: true,
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val + "%";
        }
      }

    },
    title: {
      text: 'Monthly Inflation in Argentina, 2002',
      floating: true,
      offsetY: 330,
      align: 'center',
      style: {
        color: '#444'
      }
    }
  };

  const options3 = {
    series: [{
      data: [23, 11, 54, 36, 26, 32, 2, 52,10,15]
    }],
    chart: {
      type: 'area',
      height: 160,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 0.3,
    },
    yaxis: {
      min: 0
    },
    colors: ['#DCE6EC'],
    title: {
      text: '$424,652',
      offsetX: 0,
      style: {
        fontSize: '24px',
      }
    },
    subtitle: {
      text: 'Sales',
      offsetX: 0,
      style: {
        fontSize: '14px',
      }
    }
  };

  const options4 = {
    series: [{
      data: [23, 11, 54, 36, 26, 21, 2, 10, 33, 20, 111]
    }],
    chart: {
      type: 'area',
      height: 160,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 0.3,
    },
    yaxis: {
      min: 0
    },
    colors: ['#DCE6EC'],
    title: {
      text: '$424,652',
      offsetX: 0,
      style: {
        fontSize: '24px',
      }
    },
    subtitle: {
      text: 'Sales',
      offsetX: 0,
      style: {
        fontSize: '14px',
      }
    }
  };

  
  const chart1 = new ApexCharts(chart1Ref.current, options);
  chart1.render();

  const chart2 = new ApexCharts(chart2Ref.current, options2);
  chart2.render();

  const chart3 = new ApexCharts(chart3Ref.current, options3);
  chart3.render();

  const chart4 = new ApexCharts(chart4Ref.current, options4);
  chart4.render();

  return () => {
    chart1.destroy();
    chart2.destroy();
    chart3.destroy();
    chart4.destroy();
  };
}, []);

const handleSelect = (date) => {
  let filteredData = allData.filter(item => item.date >= date.selection.startDate && item.date <= date.selection.endDate);
  setStartDate(date.selection.startDate);
  setEndDate(date.selection.endDate);
  setData(filteredData);

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
      <div ref={chart2Ref} style={chartContainerStyle}></div>
      <div ref={chart3Ref} style={chartContainerStyle}></div>
      <div ref={chart4Ref} style={chartContainerStyle}></div>
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
