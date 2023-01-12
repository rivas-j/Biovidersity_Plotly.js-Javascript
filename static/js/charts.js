function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Initialize the dashboard
init();


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // Create a variable that filters the samples for the object with the desired sample number.
    var desiredSample = samples.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var desiredResult = desiredSample[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = desiredResult.otu_ids;
    var otu_label = desiredResult.otu_labels;
    var sample_value = desiredResult.sample_values;

    // Create the yticks for the bar chart.
    var yticks = otu_id.slice(0, 10).reverse().map((id) => "OTU" + id);
    console.log(yticks);
    var xvalues = sample_value.slice(0, 10).reverse();
    console.log(xvalues);
    var hover_text = otu_label.slice(0, 10).reverse();
    console.log(hover_text);

    // Create the trace for the bar chart. 
    var barData = [{
      x: xvalues,
      y: yticks,
      text: hover_text,
      orientation: "h",
      type: "bar"
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Cultures Found"
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_id,
      y: sample_value,
      text: otu_label,
      mode: "markers",
      marker: {
        color: otu_id,
        size: sample_value,
        sizeref: 0.03,
        sizemode: "area"
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false,
      xaxis: {title: "OTU ID"},
      height: 800,
      width: 1400
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // Create a gauge chart

    // Create a variable that holds the samples array. 
    var metadata = data.metadata;
  
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugeData = metadata.filter((metaEntry) => metaEntry.id == sample);  
  
    // Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeData[0];
    console.log(gaugeResult);
    // Create variables that hold the otu_ids, otu_labels, and sample_values.

    // Create a variable that holds the washing frequency.
    var washFrequency = gaugeResult.wfreq;
    console.log(washFrequency);   
     
    // Create the trace for the gauge chart.
    var gaugeData = [{
      value: washFrequency,
      type: "indicator",
      mode: "gauge+number",
      title: "<b>Belly Button Washing Frequency<b> <br></br> Scrubs per Week",
      gauge: {
        axis: { range: [null, 10], dtick: "2" },

          bar: { color: "blue" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" },
          ]
      }
    }
    ];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
     automargin: true
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
  
  });
}

