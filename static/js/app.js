function buildMetadata(sample) {
    let metaURL = "/metadata/"+sample
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    d3.json(metaURL).then((response)=> {

      console.log(response); 
      
      // Clear existing metadata
      d3.select("#sample-metadata").html("");

      // Add a line for each metadata pair
      Object.entries(response).forEach(([key, value]) => {
        d3.select("#sample-metadata")
          .append("p")
          .text("test")
          .classed("card-text", true)
          .text(`${key}: ${value}`);
      });


    var data3 = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        value: response.WFREQ,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 24 } },
        // delta: { reference: 1, increasing: { color: "RebeccaPurple" } },
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 1], color: "#B2EC5D" },
            { range: [1, 2], color: "#66FF00" },
            { range: [2, 3], color: "#93C572" },
            { range: [3, 4], color: "#87A96B" },
            { range: [4, 5], color: "#78866B" },
            { range: [5, 6], color: "#556B2F" },
            { range: [6, 7], color: "#414833" },
            { range: [7, 8], color: "#85BB65" },
            { range: [8, 9], color: "#87A96B" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 9
          }
        }
      }
    ];
    
    var layout3 = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    };
    
    Plotly.newPlot('gauge', data3, layout3);


  });
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let sampURL = "/samples/"+sample

  d3.json(sampURL).then((response)=> {




    var trace1 = {
      labels: response.otu_ids.slice(0, 10),
      values: response.sample_values.slice(0, 10),
      text: response.otu_labels.slice(0, 10),
      type: 'pie'
    };

    var data = [trace1];

    var layout = {
      title: "Top 10 Samples Pie Chart",
    };

    Plotly.newPlot("pie", data, layout);




    var trace2 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      }
    };
    
    var data2 = [trace2];
    
    var layout2 = {
      title: 'Bubble Chart Selected Sample',
      showlegend: false,
      height: 600,
      // width: 600
      xaxis: {
        title: {
          text: 'OTU ID',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
      },
      yaxis: {
        title: {
          text: 'Sample Values',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      }
    };
    
    Plotly.newPlot('bubble', data2, layout2);

    console.log(response);
});
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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
