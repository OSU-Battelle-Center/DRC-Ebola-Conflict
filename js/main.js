mapboxgl.accessToken = 'pk.eyJ1Ijoib3N1LWJhdHRlbGxlLWNlbnRlciIsImEiOiJjanNxaHk0bm4xOGJwM3lwNmxiYjB6bWswIn0.8wMb3NDgrpO-ccAw_hPWUQ';

var months = [
'January',
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December'
];

function filterBy(month) {

  var filters = ['==', 'month', month];
  map.setFilter('Violence', filters);

  // Set the label to the month
  document.getElementById('month').textContent = months[month];
}

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/osu-battelle-center/cjvekpli50e0o1fphpmv2x5wc',
    center: [26,-0],
    zoom: 6.9
});

var icon = "circle";

map.on('load', function() {
    map.addSource('pop', {
        type: 'vector',
        url: 'mapbox://osu-battelle-center.26nno8uj'
    });
    map.addLayer({
        id: 'Population',
        type: 'heatmap',
        source: 'pop',
        maxzoom: 22,
        'source-layer': 'Population',
        paint: {
          // increase weight as diameter breast height increases
          'heatmap-weight': {
            property: 'Population',
            type: 'exponential',
            stops: [
              [1, 0],
              [62, 1]
            ]
          },
          // increase intensity as zoom level increases
          'heatmap-intensity': {
            stops: [
              [11, 1],
              [15, 3]
            ]
          },
          // assign color values be applied to points depending on their density
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,255,0)',
            0.1, 'rgba(65,105,225,1)',
            0.3, 'rgba(0,255,255,1)',
            0.5, 'rgba(0,255,0,1)',
            0.7, 'rgba(255,255,0,1)',
            1, 'rgba(255,200,0,1)'
          ],
          // increase radius as zoom increases
          'heatmap-radius': {
            stops: [
              [11, 15],
              [15, 20]
            ]
          },
          // decrease opacity to transition into the circle layer
          'heatmap-opacity': {
            default: 0.44,
            stops: [
              [14, 0.44],
              [15, 0.44]
            ]
          },
        }
      });
    map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
        "type": "geojson",
        "data": {
        "type": "Feature",
        "properties": {},
        "geometry": {
        "type": "LineString",
        "coordinates": [
            [26,-3],
            [26,3],
            [31,3],
            [31,-3],
            [26,-3]

        ]
        }
        }
        },
        "layout": {
        "line-join": "round",
        "line-cap": "round"
        },
        "paint": {
        "line-color": "#888",
        "line-width": 8
        }
        });
    
  d3.json('https://raw.githubusercontent.com/OSU-Battelle-Center/DRC-Ebola-Conflict/master/Data/kivu_security.geojson', function(err, data) {
    if (err) throw err;

    // Create a month property value based on time
    // used to filter against.
    data.features = data.features.map(function(d) {
        d.properties.month = new Date(d.properties.time).getMonth();
        return d;
        });

    map.addSource('Violence', {
        'type': 'geojson',
        data: data
        });

    map.addLayer({
        "id": "Violence",
        "type": "circle",
        "source": "Violence",
        "paint": {
                'circle-radius': {
                    'base': 10,
                    'stops': [[12, 5], [22, 10]]
                },
                'circle-color': '#ff1111'
            }
        });
    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true
    });
    map.on('mouseover', 'Violence', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.features[0].geometry.coordinates)
            .setHTML(
                "<h2>"+e.features[0].properties["0/name"]+"</h2>"+
                "<b>Date:</b> "+e.features[0].properties["time"]+"<br>"+
                "<b>Severity:</b> "+e.features[0].properties["severity_rating"]+"<br>"+
                "<b>Details:</b> "+e.features[0].properties["title/0/en"]
            )
            //.setHTML(e.features[0].properties.description)
            .addTo(map);
    });
    map.addSource('Refugees', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/OSU-Battelle-Center/DRC-Ebola-Conflict/master/Data/site_assessment_30.geojson'
    });
    map.addLayer({
        'id': 'Refugees',
        'type': 'circle',
        'source': 'Refugees',
        'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 10,
                'stops': [[12, 5], [22, 10]]
                //parseInt('e.features[0].properties["Vaccinations"]')
                },
            // color circles by ethnicity, using a match expression
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
            'circle-color': '#ffff11'
            }
    });
    map.on('mouseover', 'Refugees', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.features[0].geometry.coordinates)
            .setHTML(
            "<h2>"+e.features[0].properties["Site"]+"</h2>"+
            "<b>Date:</b> "+e.features[0].properties["Date"]+"<br>"+
            "<b>City:</b> "+e.features[0].properties["City"]+"<br>"+
            "<b>Place:</b> "+e.features[0].properties["Place"]
        )
        //.setHTML(e.features[0].properties.description)
            .addTo(map);
    });
    map.addSource('Points of Entry', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/OSU-Battelle-Center/DRC-Ebola-Conflict/master/Data/POE-working-list.geojson'
    });
    map.addLayer({
        'id': 'Points of Entry',
        'type': 'circle',
        'source': 'Points of Entry',
        'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 5,
                'stops': [[12, 5], [22, 10]]
                },
            // color circles by ethnicity, using a match expression
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
            'circle-color': '#22ddff',
            'circle-stroke-color': '#0033dd',
            'circle-stroke-width':3
            }
    });
    map.on('mouseover', 'Points of Entry', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.features[0].geometry.coordinates)
            .setHTML(
            "<h2>POE: "+e.features[0].properties["Name"]+"</h2>"+
            "<b>Type:</b> "+e.features[0].properties["Type"]
        )
        //.setHTML(e.features[0].properties.description)
            .addTo(map);
    });
    map.addSource('Vaccinations', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/OSU-Battelle-Center/DRC-Ebola-Conflict/master/Data/vaccinations.geojson'
    });
    map.addLayer({
        'id': 'Vaccinations',
        'type': 'circle',
        'source': 'Vaccinations',
        'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                property: 'Vaccinations',
                stops: [
                [{zoom: 8, value: 0}, 0],
                [{zoom: 8, value: 100}, 24],
                [{zoom: 11, value: 0}, 0],
                [{zoom: 11, value: 100}, 24],
                [{zoom: 16, value: 0}, 0],
                [{zoom: 16, value: 100}, 40]
                ]
               },
                //parseInt(
            // color circles by ethnicity, using a match expression
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
            'circle-color': '#00ff00'
            }
    });
    map.on('mouseover', 'Vaccinations', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.features[0].geometry.coordinates)
            .setHTML(
                "<h2>"+e.features[0].properties["City"]+"</h2>"+
                "<b>Date Modified:</b> "+e.features[0].properties["Date Updated"]+"<br>"+
                "<b>Vaccinations:</b> "+e.features[0].properties["Vaccinations"]
            )
            //.setHTML(e.features[0].properties.description)
            .addTo(map);
    });
    map.addSource('Health Clinics', {
        type: 'geojson',
        data: 'https://data.humdata.org/dataset/104bfeb2-f102-4770-90a7-fc8372b488f0/resource/eea74020-28b0-460f-95aa-450d70bb3d85/download/democratic-republic-of-the-congo.geojson'
    });
    map.addLayer({
        'id': 'Health Clinics',
        'type': 'circle',
        'source': 'Health Clinics',
        'paint': {
        // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 10,
                'stops': [[12, 4], [22, 10]]
            },
            // color circles by ethnicity, using a match expression
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
            'circle-color': '#ffffff'
        }
    });
    map.on('mouseover', 'Health Clinics', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.features[0].geometry.coordinates)
            .setHTML(
                "<h2>"+e.features[0].properties["Name"]+"</h2>"+
                "<b>Date Modified:</b> "+e.features[0].properties["date_modified"]+"<br>"+
                "<b>Notes:</b> "+e.features[0].properties["notes"]+"<br>"+
                "<b>Address:</b> "+e.features[0].properties["physical-address"]
            )
            //.setHTML(e.features[0].properties.description)
            .addTo(map);
    });
    filterBy(0);

    document.getElementById('slider').addEventListener('input', function(e) {
        var month = parseInt(e.target.value, 10);
        filterBy(month);
    });

  });
});

var toggleableLayerIds = [ 'Violence','Population','Refugees', 'Health Clinics','Vaccinations','Points of Entry'];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}
