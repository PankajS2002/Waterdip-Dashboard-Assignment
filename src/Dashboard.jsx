import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';

const Dashboard = () => {
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
        position: 'top', // top, center, bottom
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
    data: [23, 11, 54, 36, 26, 32, 2, 52, 12, 23, 43, 53]
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
    data: [23, 11, 54, 36, 26, 32, 2, 52, 12, 23, 43, 53]
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


  useEffect(() => {
    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
   
    const chart2 = new ApexCharts(document.querySelector("#chart"), options2);
    chart2.render();

    const chart3 = new ApexCharts(document.querySelector("#chart"), options3);
    chart3.render();
    
    const chart4 = new ApexCharts(document.querySelector("#chart"), options4);
    chart4.render();
   
    return () => {
      chart.destroy();
      chart2.destroy();
      chart3.destroy();
      chart4.destroy();
      
    };
 
  }, [options,options2,options3,options4]);

  return (
    <div id="chart">
      <Chart options={options} series={[{ data: dates }]} type="area" height={350} />
    </div>
  );
};
export default Dashboard;









  
 
