// Creating the map object
let myMap = L.map("map", {
  center: [27.96044, -82.30695],
  zoom: 7
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
let geoData = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/ACS-ED_2014-2018_Economic_Characteristics_FL.geojson";

// To do:

// Get the data with d3.
d3.json(geoData).then(function (data) {
  console.log(data);
  
  let choroplethData = L.choropleth(data, {
    valueProperty: 'DP03_16E', // which property in the features to use
    scale: ["#ffffb2", "#b10026"], // chroma.js scale - include as many as you like
    steps: 10, // number of breaks or steps in range
    mode: 'q', // q for quantile, e for equidistant, k for k-means
    style: {
      color: '#fff', // border color
      weight: 2,
      fillOpacity: 1
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3> Estimated employed population with school-aged children: ${feature.properties.DP03_16E} </h3> <hr> <h4>Estimated Total Income and Benefits for Families: $${feature.properties.DP03_75E}</h4`)
    }
  }).addTo(myMap);

  // Add legend (don't forget to add the CSS from index.html)
  let legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend')
    let limits = choroplethData.options.limits
    let colors = choroplethData.options.colors
    let labels = []

    // Add min & max
    div.innerHTML = '<div class="legend-title">Population with children age (6-17) </div><div class="labels"><div class="min">' + limits[0] + '</div> \
        <div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  legend.addTo(myMap)
})
