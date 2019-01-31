function buildMetadata(sample) {
  //This function will build the metadata panel
    var data;
    var sample_url=`/metadata/${sample}`
  // Use `d3.json` to fetch the metadata for a sample
    d3.json(sample_url).then(function(response) {
  //  get Wash Frequency (Scrubs Per week) for gauge plot
      WFREQ_value=response.WFREQ

  // display the metadata in html:
      data=Object.entries(response)
      selector=d3.select("#sample-metadata")
      selector.html("")
      selector.append('br')  
      data.forEach(function([key,value]){
                        selector.append('p')
                                .text(`${key}:  ${value}`)})
    // BONUS: Build the Gauge Chart
    buildGauge(WFREQ_value);
})}

function buildCharts(sample) {
  var data;
  //  Use `d3.json` to fetch the sample data for the plots
  var sample_url=`/samples/${sample}`
  
    d3.json(sample_url).then(function(response) {

      data=Object.entries(response)
      otu_values=data[2][1]
      otu_ids=data[0][1]
      otu_labels=data[1][1]


    // https://stackoverflow.com/questions/3730510/javascript-sort-array-and-return-an-array-of-indicies-that-indicates-the-positi
      var result = Array.from(Array(otu_values.length).keys())
             .sort((x, y) => otu_values[parseInt(x)] < otu_values[parseInt(y)] ? 1 :otu_values[parseInt(x)] == otu_values[parseInt(y)]  ? 0 : -1)
  
      var  color_arr=result.map(i=>otu_ids[i]).slice(0,10);
      var  size_arr= result.map(i=>otu_values[i]).slice(0,10); 
    
      color_arr=color_arr.map(x=>x/d3.sum(color_arr)) 
      size_arr=size_arr.map(x=>x/d3.sum(size_arr)*500) 
  

      // Build a Bubble Chart using the sample data
    data_bubble = [{
      y: result.map(i=>otu_values[i]).slice(0,10),
      x: result.map(i=>otu_ids[i]).slice(0,10),
      mode: 'markers',
      // hoverinfo: 'label+percent+text',
      // ids: result.map(i=>data[1][1][i]).slice(0,10),
      text:result.map(i=>otu_labels[i]).slice(0,10),
      // textinfo: 'text+percent',
      name:`${sample}th sample`,
      // hoverinfo:"text+y",
      // hoverlabel:{bgcolor:"red",bordercolor:"green",font:{color:"blue"} },

      
      marker:{color:color_arr,size:size_arr},

      // marker:{color:result.map(i=>otu_ids[i]*0.001).slice(0,10)
      //         ,size:result.map(i=>otu_values[i]).slice(0,10)},
      opacity: 0.5
    }];
    
    var layout = {
      height: 600,
      width: 1000,
      showlegend: false,
      title: 'bubble plot for belly-button-biodiversity'
    };
    Plotly.newPlot("bubble", data_bubble, layout);

    // @TODO: Build a Pie Chart
    data_pie = [{
      values: result.map(i=>otu_values[i]).slice(0,10),
      labels: result.map(i=>otu_ids[i]).slice(0,10),
      type: 'pie',
      hoverinfo: 'label+percent+text',
      ids: result.map(i=>otu_labels[i]).slice(0,10),
      text:result.map(i=>otu_labels[i]).slice(0,10),
      textinfo: 'percent',
      name:"belly-button-biodiversity",
      hoverlabel:{bgcolor:"blue",bordercolor:"red",font:{color:"white"} },
      marker:{line:{color:"yellow",width:"2"}}
    }];
    
    var layout = {
      height: 400,
      width: 500,
      showlegend: true,
      title: 'pie plot for belly-button-biodiversity'
    };
    
    Plotly.newPlot('pie', data_pie, layout);
  })}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log(firstSample)
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();