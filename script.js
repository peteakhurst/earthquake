let map;

async function initMap() {
  //@ts-ignore
  const { Map } = await google.maps.importLibrary('maps');

  map = new Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  });
  // Create a letiable to hold the earthquake markers
  let markers = [];

  // Create an info window object
  let infoWindow = new google.maps.InfoWindow();
  // Fetch the earthquake data
  fetch(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
  )
    .then((response) => response.json())
    .then((data) => {
      // Loop through the earthquake data
      data.features.forEach((feature) => {
        // Get the coordinates of the earthquake
        let latLng = new google.maps.LatLng(
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0]
        );

        // Create a marker for the earthquake
        let marker = new google.maps.Marker({
          position: latLng,
          map: map,
        });

        // Add the marker to the markers array
        markers.push(marker);

        // Create an event listener for the marker
        marker.addListener('click', function () {
          // Set the content of the info window
          infoWindow.setContent(
            '<strong>' +
              feature.properties.place +
              '</strong><br>' +
              new Date(feature.properties.time).toLocaleString()
          );

          // Open the info window
          infoWindow.open(map, marker);

          // Show the earthquake details panel
          let panelElement = document.getElementById('panel');
          panelElement.innerHTML =
            '<h2>' +
            feature.properties.place +
            '</h2><p><strong>Magnitude:</strong> ' +
            feature.properties.mag +
            '</p><p><strong>Depth:</strong> ' +
            feature.geometry.coordinates[2] +
            ' km</p>';
          panelElement.style.display = 'block';
        });
      });
    });

  //Create an event listener for the map
  map.addListener('click', function () {
    // Close the info window
    infoWindow.close();

    // Hide the earthquake details panel
    let panelElement = document.getElementById('panel');
    panelElement.style.display = 'none';
  });
}
