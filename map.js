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
  d3.json("BayAreaCounties.geojson").then(function(data){
    var newOb = data; 
    // for (var i in newOb.features) {  
    //     checkCounty.push(newOb.features[i].properties.county);   
    //    }
    //    for (var i in newOb) {  
    //     myObject.jsonOne.push(newOb.features[i]);
    //    }
        myObject.jsonOne.push(newOb)
        console.log(newOb)
    //    console.log(Object.keys(newOb.features[0].properties.county))
      }); 
  
  
  d3.json("https://cors-anywhere.herokuapp.com/" + "ucb-dbc-project2.herokuapp.com/county_single_family").then(function(data) {
    var anotherObject = data;
    // console.log(JSON.stringify(anotherObject));
    // const ordered = {};
    // for (i in  anotherObject){
    // Object.keys(anotherObject[i]).sort().forEach(function(key) {
    // ordered[key] = unordered[key];
    // })};
    // for (i in  anotherObject){
    //     data.sort(function(a, b) {
    //         return a[i].RegionName > ba[i].RegionName;
    //     });
    // };
    // data.sort();
    // console.log(data);
    // console.log(Object.keys(anotherObject[0]))
    // for (var i in anotherObject){
    //     console.log(anotherObject[i].RegionName)
        
    //     };
    myObject.jsonTwo.push(anotherObject)
    console.log(myObject.jsonTwo[0])
    console.log(myObject)
    
  // Grabbing data with d3...
    var geoJson;
    d3.map(myObject.jsonOne, function(data) {
        console.log(data)
        // console.log(data)
        // Creating a new choropleth layer
        geoJson = L.choropleth(data, {
        // Which property in the features to use
        valueProperty: function (feature) {
            for (i in myObject.jsonTwo[0]){
            return myObject.jsonTwo[0][i]["1996-04"]
            }
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
});
