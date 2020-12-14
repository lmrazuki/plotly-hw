const url = "./samples.json";

function init() {
  var dropdown = d3.select("#selDataset");
  d3.json(url).then(function (data) {
    data.names.forEach(function (name) {
      dropdown.append("option").text(name).property("value");
    });
    buildPlots("940");
    buildMetadata(940);
  });
}

function buildPlots(sample) {
  d3.json(url).then(function (data) {
    var filteredData = data.samples.filter((d) => d.id === sample);
    filteredData.forEach((data) => {
      var sample_values = data.sample_values;
      var otu_ids = data.otu_ids;
      var otu_labels = data.otu_labels;

      var otu_id = [];
      otu_ids.forEach((d) => {
        otu_id.push("OTU " + d);
      });

      var bar_data = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_id.slice(0, 10),
        type: "bar",
        orientation: "h",
      };

      var data = [bar_data];

      var barArea = d3.select(".bar");
      var layout = {
        title: "'Bar' Chart",
      };
      Plotly.newPlot("bar", data, layout);

      var trace1 = {
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
        },
        text: otu_labels,
      };

      var layout = {
        xaxis: { title: "OTU ID" },
        height: 600,
        width: 1300,
      };

      var data1 = [trace1];

      Plotly.newPlot("bubble", data1, layout);
    });
  });
}

function buildMetadata(sample) {
  d3.json(url).then(function (data) {
    var filterData = data.metadata.filter((d) => d.id === sample);
    var trows = d3.select("tbody");
    trows.remove();

    var table = d3.select("#sample-metadata");
    var tbody = table.append("tbody");
    filterData.forEach((rows) => {
      Object.entries(rows).forEach(([key, value]) => {
        var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(`${key}: ${value}`);
      });
    });
  });
}

init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildPlots(newSample);
  buildMetadata(parseInt(newSample));
}
