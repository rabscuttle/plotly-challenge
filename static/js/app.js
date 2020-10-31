// Office hours was used as starter code

// Function to initialize the page
function Init() {  

    // Pull in JSON
    d3.json("samples.json").then((data) => {
        
        // Variables
        var selector = d3.select("#selDataset");
        var options = data.names; 
  
        // Populate the dropdown
        options.forEach((sampleId) => {
            selector.append("option").text(sampleId).property("value", sampleId);
        });
        
        // Get first sample Id
        var sampleId = options[0];
     
        // Draw the graphs
        create_bar_graph(sampleId);
        create_bubble_chart(sampleId);
        create_gauge_chart(sampleId);
        show_metadata(sampleId);
  
    });
  }

// Update page function
function optionChanged(newSampleId) {
  
    create_bar_graph(newSampleId);
    create_bubble_chart(newSampleId);
    create_gauge_chart(newSampleId);
    show_metadata(newSampleId);
  }

// Bar graph function
function create_bar_graph(sampleId) {
    
  // Pull in JSON
  d3.json("samples.json").then((data) => {
  
      // Variables
      var samples = data.samples;
      var results = samples.filter(sample => sample.id == sampleId);
      var result = results[0];
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
      
      // Bar data
      var bar_data = {
          x: sample_values.slice(0,10).reverse(),
          y: otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse(),
          type: "bar",
          text: otu_labels.slice(0,10).reverse(),
          orientation: "h"
      };

      // Bar layout
      var bar_layout = {
          title: "Top 10 Bacteria Cultures",
          margin: {t: 30, l:150}
      };

      // Plot bar graph
      Plotly.newPlot("bar", [bar_data], bar_layout);
  });
}

// Bubble chart function
function create_bubble_chart(sampleId) {
  
  // Pull in JSON
  d3.json("samples.json").then((data) => {
	  
	  // Variables
      var samples = data.samples;
      var results = samples.filter(sample => sample.id == sampleId);
      var result = results[0];
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
      
      // Bubble data
      var bubble_data = {
          x: otu_ids,
          y: sample_values,
          mode: 'markers',
          text: otu_labels, 
          marker: {
              color: otu_ids,
              size: sample_values
          }   
      };

      // Bubble layout
      var bubble_layout = {
          title: "Bacterial Cultures Found",
          xaxis: { title: "OTU IDs"},
      };

      // Plot bubble graph
      Plotly.newPlot("bubble", [bubble_data], bubble_layout);
  })
}

// Gauge function
function create_gauge_chart(sampleId) {

  // Pull in JSON
  d3.json("samples.json").then((data) => {
	  
	  // Variables
      var filteredData = data.metadata.filter(metadata => metadata.id == sampleId);
      var washFreq = filteredData[0].wfreq;

      // Gauge data
      var gauge_data = {
          value: washFreq,
          title: { text: "Scrubs per Week"},
          type: "indicator",
          text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
          mode: "gauge+number",
          gauge: {
              bar: {color: "red"},
              axis: {range: [null, 9]},
              steps: [
                  { range: [0, 1], color: "lightgray", text: "0-1" },
                ]
          }
      }

      // Gauge layout
      var gauge_layout = {
          title: "Belly Button Washing Frequency"
      };

      // Plot gauge graph
      Plotly.newPlot("gauge", [gauge_data], gauge_layout);
      
  })
}

// Metadata function
function show_metadata(sampleId) {
  
  // Pull in JSON
  d3.json("samples.json").then((data) => {

      // Variables
      var demographic = data.metadata;
      var results = demographic.filter(demographic => demographic.id == sampleId);
      var result = results[0];
      var panel = d3.select('#sample-metadata');
      panel.html("");

      // For each entry
      Object.entries(result).forEach(([k, v]) => {
          var text = `${k} = ${v}`;
          panel.append("h6").text(text);
      });
  });
}

Init()