import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import Data from './data.csv';
import ApexCharts from 'apexcharts';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';

const App = () => {
 const [data, setData] = useState([]);
 const [allData, setAllData] = useState([]);
 const [countryData, setCountryData] = useState([]);
 const [adultData, setAdultData] = useState([]);
 const [childData, setChildData] = useState([]);
 const [startDate, setStartDate] = useState(new Date());
 const [endDate, setEndDate] = useState(new Date());
 const [chart, setChart] = useState(null);
 const [chart2, setChart2] = useState(null);
 const chart1Ref = useRef(null);
 const chart2Ref = useRef(null);
 const sparkline1Ref = useRef(null);
 const sparkline2Ref = useRef(null);
 const [sparkline1, setSparkline1] = useState(null);
 const [sparkline2, setSparkline2] = useState(null);

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
   const visitorsPerCountry = new Map();
   const adultVisitorsPerDay = new Map();
   const childVisitorsPerDay = new Map();

   parsedData.forEach(item => {
     const dateStr = `${item.arrival_date_year}-${monthMapping[item.arrival_date_month]}-${item.arrival_date_day_of_month}`;
     const totalVisitors = parseInt(item.adults, 10) + parseInt(item.children, 10) + parseInt(item.babies, 10);
     const totalAdultVisitors = parseInt(item.adults, 10);
     const totalChildVisitors = parseInt(item.children, 10);

     if (visitorsPerDay.has(dateStr)) {
       visitorsPerDay.set(dateStr, visitorsPerDay.get(dateStr) + totalVisitors);
     } else {
       visitorsPerDay.set(dateStr, totalVisitors);
     }

     if (visitorsPerCountry.has(item.country)) {
       visitorsPerCountry.set(item.country, visitorsPerCountry.get(item.country) + totalVisitors);
     } else {
       visitorsPerCountry.set(item.country, totalVisitors);
     }

     if (adultVisitorsPerDay.has(dateStr)) {
       adultVisitorsPerDay.set(dateStr, adultVisitorsPerDay.get(dateStr) + totalAdultVisitors);
     } else {
       adultVisitorsPerDay.set(dateStr, totalAdultVisitors);
     }

     if (childVisitorsPerDay.has(dateStr)) {
      childVisitorsPerDay.set(dateStr, childVisitorsPerDay.get(dateStr) + totalChildVisitors);
   } else {
     childVisitorsPerDay.set(dateStr, totalChildVisitors);
   }
  });

  const offsetIST = 5.5 * 60 * 60 * 1000;
  const adultChartData = Array.from(adultVisitorsPerDay, ([dateStr, visitors]) => ({ date: new Date(dateStr).getTime() + offsetIST, visitors }));
  const childChartData = Array.from(childVisitorsPerDay, ([dateStr, visitors]) => ({ date: new Date(dateStr).getTime() + offsetIST, visitors }));

  setData(adultChartData);
  setAllData(adultChartData);
  setAdultData(adultChartData);
  setChildData(childChartData);
  setCountryData(Array.from(visitorsPerCountry, ([country, visitors]) => ({ country, visitors })));
};
const generateChartData = (data, startDate, endDate) => {
  return data.filter(item => item.date >= startDate && item.date <= endDate)
             .map(item => [item.date, item.visitors]);
};
useEffect(() => {
  fetchData();
}, []);

useEffect(() => {
  if (data.length > 0) {
    const options = {
      series: [{
        name: 'Visitors',
        data: generateChartData(data, startDate, endDate)
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

    const sparkline1Options = {
      series: [{ data: generateChartData(adultData, startDate, endDate).map(item => item[1]) }],
      chart: { type: 'area', height: 160, sparkline: { enabled: true } },
      stroke: { curve: 'straight' },
      fill: { opacity: 0.3 },
      yaxis: { min: 0 },
      colors: ['#DCE6EC'],
      title: { text: 'Total Adult Visitors' },
    };

    const sparkline1Instance = new ApexCharts(sparkline1Ref.current, sparkline1Options);
    sparkline1Instance.render();
    setSparkline1(sparkline1Instance);

    return () => {
      chartInstance.destroy();
      sparkline1Instance.destroy();
    };
  }
}, [data]);

useEffect(() => {
  if (chart) {
    const newSeries = [{
      name: 'Visitors',
      data: generateChartData(allData, startDate, endDate)
    }];
    chart.updateSeries(newSeries);
  }

  if (sparkline1) {
    const newSeries = [{ data: generateChartData(adultData, startDate, endDate).map(item => item[1]) }];
    sparkline1.updateSeries(newSeries);
  }
}, [startDate, endDate, allData, chart, sparkline1]);
useEffect(() => {
  if (countryData.length > 0) {
    const options = {
      series: [{
        name: 'Visitors',
        data: countryData.map(item => item.visitors),
      }],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: countryData.map(item => item.country),
      },
      title: {
        text: 'Visitors by Country',
        align: 'left',
      },
    };

    const chartInstance = new ApexCharts(chart2Ref.current, options);
    chartInstance.render();
    setChart2(chartInstance);

    const sparkline2Options = {
      series: [{ data: generateChartData(childData, startDate, endDate).map(item => item[1]) }],
      chart: { type: 'area', height: 160, sparkline: { enabled: true } },
      stroke: { curve: 'straight' },
      fill: { opacity: 0.3 },
      yaxis: { min: 0 },
      colors: ['#DCE6EC'],
      title: { text: 'Total Child Visitors' },
    };

    const sparkline2Instance = new ApexCharts(sparkline2Ref.current, sparkline2Options);
    sparkline2Instance.render();
    setSparkline2(sparkline2Instance);

    return () => {
      chartInstance.destroy();
      sparkline2Instance.destroy();
    };
  }
}, [countryData]);

useEffect(() => {
  if (sparkline2) {
    const newSeries = [{ data: generateChartData(childData, startDate, endDate).map(item => item[1]) }];
    sparkline2.updateSeries(newSeries);
  }
}, [startDate, endDate, childData, sparkline2]);

const handleSelect = (date) => {
  setStartDate(date.selection.startDate);
  setEndDate(date.selection.endDate);
}

const selectionRange = {
  startDate: startDate,
  endDate: endDate,
  key: 'selection',
}

const chartContainerStyle = {
  width: '45%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '20px',
};

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
      <div ref={sparkline1Ref} style={chartContainerStyle}></div>
      <div ref={sparkline2Ref} style={chartContainerStyle}></div>
    </div>
  </div>
);
};

export default App;
