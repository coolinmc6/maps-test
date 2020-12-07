/*
I struggled for awhile to get these tooltips. Here are the key items to do:
#1 - CSS for the tooltip; it has a class of: .mapboxgl-popup
#2 - Add description in the property of the GeoJSON (for each feature)
      - we'll probably want some kind of callback the user can write
#3 - Create Popup
      - standard code from MapBox; nothing too controversial there
#4 - Create the event handler that is placed on the layer
      - I must use the correct layer name
#5 - Remove event handler

*/


mapboxgl.accessToken = 'pk.eyJ1IjoiY29vbGlubWM2IiwiYSI6ImNrMDZ0azk2ajN6cGczY212OTU2MTE5YWwifQ._dpWct8j09y0CJWXRrAaPQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-77.04, 38.907],
  zoom: 11.15
  // zoom: 22
  // zoom: 6
});

function convertGeoJSON() {
  let goodGeoJSON = {
    "type": "FeatureCollection",
    "features": []
  }
  
  let objects = new Array(100).fill('').map((item, i) => {
    // let lat = -77.04 + (Math.random()*10000 - 20000)/1000
    // let lon = 38.907 + (Math.random()*10000 - 20000)/1000
    let lat = Number((-77.04 - (Math.random()*20000 - 10000)/100000).toFixed(2))
    let lon = Number((38.907 + (Math.random()*20000 - 10000)/100000).toFixed(2))
    let obj = {
      name: "Item #" + i,
      coords: [lat, lon]
    }
    return buildFeature(obj)
  })
  goodGeoJSON.features = objects;
  console.log(goodGeoJSON, 'event handler added')
  return goodGeoJSON;
}

function buildFeature(obj) {
  return {
    "type": "Feature",
    "properties": {
      "description": "Awesome Description",
      "name": obj.name,
      "count": Math.floor(Math.random()*10000),
      "gender": Math.floor(Math.random()*2)
    },
    "geometry": {
      "type": "Point",
      "coordinates": obj.coords
    }
  }
}

function descriptionCallback() {

}
let data = convertGeoJSON()
map.on('load', function() {
  

  map.addSource('users', { 
    type: 'geojson',
    data: data
  });

  map.addLayer({
    'id': 'user-dots',
    'type': 'circle',
    'source': 'users',
    'paint': {
      'circle-stroke-width': 1,
      'circle-color': 'rgb(255, 0, 0)',
      'circle-radius': 10
    }
  })

  // #3: Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
  });

  // #4: Create event handler when mouseenter over a point
  map.on('mouseenter', 'user-dots', function(e) {
    console.log(e);
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });

  // #5 - Remove Event Handler on correct layer
  map.on('mouseleave', 'user-dots', function() {
    map.getCanvas().style.cursor = '';
    // popup.remove();
  });

})