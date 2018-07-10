var month_list = ["2010-12", "2011-03", "2011-06", "2011-09", "2011-12", "2012-03", "2012-06", "2012-09", "2012-12", "2013-03", "2013-06", "2013-09", "2013-12", "2014-03", "2014-06", "2014-09", "2014-12", "2015-03", "2015-06", "2015-09", "2015-12", "2016-03", "2016-06", "2016-09", "2016-12", "2017-03", "2017-06", "2017-09", "2017-12", "2018-03"];
var populate_dropdown = d3.select("body").selectAll("#date-selector").selectAll("option").data(month_list).enter().append("option").text(function(d) {
    return d;
});

var dd_value = d3.select("#date-selector").node().value; 

console.log(dd_value);

document.getElementById("date-selector").addEventListener("change", function() {
    dd_value = d3.select("#date-selector").node().value;
    console.log(dd_value);
    drawMap();
}, false);

//Mapping piece
function drawMap() {
    console.log("running")
    var map = L.map("map", {
    center: [37.752361, -122.080389],
    zoom: 9
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiamVzc2J1cmdvcyIsImEiOiJjamlkdm14dzEwNnZqM3BwbnA3a3ZmcXZ4In0.S_8R6Xa8awTcuIXPU7jexA").addTo(map);
  var myObject = {
        jsonOne: [],
        jsonTwo: []
      };
  var checkCounty = [];
  var combinedJSON;
  d3.json("./BayAreaCounties.geojson").then(function(data){
    //   debugger;
    var newOb = data; 

        myObject.jsonOne.push(newOb)
        console.log(newOb)
    //    console.log(Object.keys(newOb.features[0].properties.county))
      }); 
  
  
  d3.json("https://cors-anywhere.herokuapp.com/" + "ucb-dbc-project2.herokuapp.com/county_single_family").then(function(data) {
    var anotherObject = data;
    // debugger;
    anotherObject = Object.values(anotherObject).sort((a, b) => {
        var nameA = a.RegionName.toUpperCase();
        var nameB = b.RegionName.toUpperCase();
      
        if (nameA < nameB) { return -1; }
        if (nameA > nameB) { return 1; }
        return 0;
      });

    myObject.jsonTwo.push(anotherObject)
    console.log(myObject.jsonTwo[0][0])
    console.log(myObject)
    
  // Grabbing data with d3...
    var geoJson;
    console.log('APPLE')
    d3.map(myObject.jsonOne, function(data) {
        console.log('BANANA')
        console.log(data)
        // console.log(data)
        // Creating a new choropleth layer
        geoJson = L.choropleth(data, {
        // Which property in the features to use
        valueProperty: function (feature, i) {
            var foo = myObject.jsonTwo[0].find(a => a.RegionName == feature.properties.county)[`${dd_value}`];
            // debugger;
            return foo;
          },
        // Color scale
        scale: ["#ffffb2", "#b10026"], 
        // Number of breaks in step range
        steps: 10, //amount of tiers
        // q for quantile, e for equidistant, k for k-means
        mode: "q", //tries to split into equal amounts of data in tiers!!!
        style: {
            // Border color
            color: "#fff",
            weight: 1.5,
            fillOpacity: 0.5
        },
            onEachFeature: function(feature, layer) {
                layer.on({
                // On mouse over, make the feature (neighborhood) more visible
                mouseover: function(event) {
                    layer = event.target;
                    layer.setStyle({
                    fillOpacity: 0.9
                    });
                },
                // Set the features style back to the way it was
                mouseout: function(event) {
                    geoJson.resetStyle(event.target);
                },
                // When a feature (neighborhood) is clicked, fit that feature to the screen
                click: function(event) {
                    map.fitBounds(event.target.getBounds());
                }
            });
            layer.bindPopup("<h2>" + feature.properties.county + "</h2>" + "<hr>"+"<h2>" + "$" +myObject.jsonTwo[0][0]["1996-04"]+ "</h2>" );
        }
        }).addTo(map);
  
    console.log(geoJson)
  
    // Setting up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geoJson.options.limits;
      var colors = geoJson.options.colors;
      var labels = [];
  
      // Add min & max
      var legendInfo = "<h1>Average Home Prices</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" +"$"+ limits[0] + "</div>" +
          "<div class=\"max\">" +"$"+  limits[limits.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(map);
  
  });
  console.log('CHERRY')
});
}

drawMap()
