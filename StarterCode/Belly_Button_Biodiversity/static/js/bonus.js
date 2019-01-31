function  buildGauge(degrees){
    // this function will plot a gauge to Belly Button Scrubs per week
  console.log("degrees=",degrees)
  var  radius = .5;
  var radians = degrees * Math.PI / 7; // 7(instead of 180 for usual degrees for a half circle) is almost max number of Scrubs 
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);
  
  //  Path: to create a triangle which looks a pointer
  var mainPath = 'M -0.0 -0.025 L 0.00 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
  var data = [
    //the small circle at the origin of the gauge
    { type: 'scatter',
     x: [0], 
     y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'Scrubs/week',
      text: degrees,
      hoverinfo: 'text+name'},
  
    // the appearance of the gauge: seven regions + one blank region which is lower half of the pie plot
    { values: [50/7, 50/7, 50/7, 50/7, 50/7, 2*50/7, 50],
    rotation: 65,
    text: ['0-1', '1-2', '2-3', '3-4',
              '4-5', '>5', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                           'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                           'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                           'rgba(255, 255, 255, 0)']},
    labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '>5', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    sort: false,
    showlegend: true
  }];
  
  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '50000'
        }
      }],
   title: 'Belly Button Washing Frequency(Scrubs/week)', 
   Speed: '0-100',
    height: 500,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };
  
  Plotly.newPlot('gauge', data, layout);
  
  }
