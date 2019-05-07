map.on('load', function() {
	map.addSource('DRC0', {
        type: 'vector',
        data: 'https://raw.githubusercontent.com/OSU-Battelle-Center/DRC-Ebola-Conflict/master/Data/population/box_cod_0.geojson'
    });
	map.addLayer({
		id: 'DRC0',
		type: 'heatmap',
		source: 'pop',
		maxzoom: 22,
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
	});