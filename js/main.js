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
  map.setFilter('violence', filters);

  // Set the label to the month
  document.getElementById('month').textContent = months[month];
}

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/osu-battelle-center/cjsqq2icr01591foxt2ctxcoe',
    center: [28.771726,-0.384252],
    zoom: 7
});

var icon = "circle";

map.on('load', function() {
  d3.json('https://raw.githubusercontent.com/OSU-Battelle-Center/DRC-Ebola-Conflict/master/Data/kivu_security.geojson', function(err, data) {
    if (err) throw err;

    // Create a month property value based on time
    // used to filter against.
    data.features = data.features.map(function(d) {
        d.properties.month = new Date(d.properties.time).getMonth();
        return d;
        });

    map.addSource('violence', {
        'type': 'geojson',
        data: data
        });

    map.addLayer({
        "id": "violence",
        "type": "circle",
        "source": "violence",
        "paint": {
                'circle-radius': {  
                    'base': 10,
                    'stops': [[12, 3], [22, 10]]
                },
                'circle-color': '#880000'
            }
        });
    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true
    });
    map.on('mouseover', 'violence', function(e) {
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
    map.addSource('site assessments', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/OSU-Battelle-Center/DRC-Ebola-Conflict/master/Data/site_assessment_30.geojson'
    });
    map.addLayer({
        'id': 'site assessments',
        'type': 'circle',
        'source': 'site assessments',
        'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 5,
                'stops': [[12, 4], [22, 10]]
                },
            // color circles by ethnicity, using a match expression
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
            'circle-color': '#ff0f0f'
            }
    });
    map.addSource('vaccinations', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/OSU-Battelle-Center/DRC-Ebola-Conflict/master/Data/vaccinations.geojson'
    });
    map.addLayer({
        'id': 'vaccinations',
        'type': 'circle',
        'source': 'vaccinations',
        'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 5,
                'stops': [[12, 4], [22, 10]]
                },
            // color circles by ethnicity, using a match expression
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
            'circle-color': '#00aa00'
            }
    });
    map.on('mouseover', 'vaccinations', function(e) {
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
    map.addSource('pop', {
        type: 'vector',
        url: 'mapbox://osu-battelle-center.347zqs23'
    });
    map.addLayer({
        id: 'pop-dens',
        type: 'heatmap',
        source: 'pop',
        maxzoom: 22,
        'source-layer': 'populations-2dl34g',
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
            0, 'rgba(0,0,256,0)',
            0.2, 'rgba(0,0,256,0.2)',
            0.4, 'rgba(0,256,0,0.4)',
            0.6, 'rgba(256,256,0,0.4)',
            0.8, 'rgba(256,0,0,0.4)'
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
            default: 1,
            stops: [
              [14, 1],
              [15, 0]
            ]
          },
        }
      });
    map.on('mouseover', 'site assessments', function(e) {
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
    map.addSource('clinics', {
        type: 'geojson',
        data: 'https://data.humdata.org/dataset/104bfeb2-f102-4770-90a7-fc8372b488f0/resource/eea74020-28b0-460f-95aa-450d70bb3d85/download/democratic-republic-of-the-congo.geojson'
    });
    map.addLayer({
        'id': 'clinics',
        'type': 'circle',
        'source': 'clinics',
        'paint': {
        // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 5,
                'stops': [[12, 4], [22, 10]]
            },
            // color circles by ethnicity, using a match expression
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
            'circle-color': '#ff05c5'
        }
    });
    map.on('mouseover', 'clinics', function(e) {
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

var toggleableLayerIds = [ 'violence','site assessments', 'clinics','vaccinations'];

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