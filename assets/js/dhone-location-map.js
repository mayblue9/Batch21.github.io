
mapboxgl.accessToken = 'pk.eyJ1IjoiYmF0Y2gyMSIsImEiOiJQUDEzTDBzIn0.49sCQ1PnCzCwXO1L8w51Ug';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
    center: [78.6757, 18.9209], // starting position
    zoom: 3.8 // starting zoom
});

mapboxgl.accessToken = 'pk.eyJ1IjoiYmF0Y2gyMSIsImEiOiJQUDEzTDBzIn0.49sCQ1PnCzCwXO1L8w51Ug';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/batch21/ciqw43rbk000bcbmbwohidax7', //stylesheet location
    center: [78.6757, 18.9209], // starting position
    zoom: 3.5 // starting zoom
});


map.addControl(new mapboxgl.Navigation());
map.scrollZoom.disable();

map.on('style.load', function() {
  map.addSource("villageBoundary", {
    "type": "geojson",
    "data": "/assets/data/dhone_area.json"
    });

	map.addLayer({
	    'id': 'revenue-village-boundary',
	    'type': 'line',
	    "minzoom": 4,
	    'source': 'villageBoundary',
	    'layout': {},
	    'paint': {
	        'line-color': 'black',
	    	'line-width': 2
	    } 
	   
	});
});

map.on('style.load', function() {
  map.addSource("villageAreas", {
    "type": "geojson",
    "data": "/assets/data/village_areas.json"
    });

	map.addLayer({
	    'id': 'village-boundary',
	    'type': 'line',
	    "minzoom": 5.5,
	    "maxzoom": 13.5,
	    'source': 'villageAreas',
	    'layout': {},
	    'paint': {
	        'line-color': 'red',
	    	'line-width': 1
	    } 
	   
	});

	map.addLayer({
	    'id': 'village-areas',
	    'type': 'fill',
	    "minzoom": 5.5,
	    "maxzoom": 13.5,
	    'source': 'villageAreas',
	    'layout': {},
	    'paint': {
	    	'fill-color': "#DF837D",
	        'fill-opacity': 0.5
	    } 
	   
	});

	map.addLayer({
	    'id': 'village-areas-hover',
	    'type': 'fill',
	    "minzoom": 5.5,
	    "maxzoom": 13.5,
	    'source': 'villageAreas',
	    'layout': {},
	    'paint': {
	    	'fill-color': "#DF837D",
	        'fill-opacity': 0.1
	    },
	    "filter": ["==", "name", ""] 
	   
	});

	map.on("mousemove", function(e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["village-areas"] });
        if (features.length) {
            map.setFilter("village-areas-hover", ["==", "name", features[0].properties.name]);
        } else {
            map.setFilter("village-areas-hover", ["==", "name", ""]);
        }
    });

});

map.on('style.load', function() {
  map.addSource("villageCentres", {
    "type": "geojson",
    "data": "/assets/data/dhone_village_centres.json"
    });

    map.addLayer({
	    "id": "labels",
	    "type": "symbol",
	    "source": "villageCentres",
	    "minzoom": 10,
	    "maxzoom": 12.6,
	    "layout": {
	        "text-field": "{name}",
	        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
	        "text-offset": [-2, -2],
	        "text-anchor": "top",
	        "text-size": 10,
	        "text-allow-overlap": true,
	        "text-letter-spacing": 0.1
	    },
	    "paint":{
	    	"text-halo-color": "#dddddd",
	    	"text-halo-width": 2,
	    	"text-halo-blur": 1
	    }
    });

});

var popup = new mapboxgl.Popup({closeOnClick: false, closeButton: false, anchor: 'right'})
    .setLngLat([77.81, 15.40])
    .setHTML('<p>Revenue Village</p>')
    .addTo(map);

//map.on("zoom", labelAddRemove)

function labelAddRemove(){
	if(map.getZoom() > 7){
		popup.remove();
	} else if(map.getZoom() < 7){
		popup.addTo(map);
	}
}

document.getElementById('villageZoom').addEventListener('click', function() {

	popup.remove();

	map.flyTo({

		center: [77.8271, 15.389],
        zoom: 11.5,
        bearing: 0,
        speed: 0.3,
        curve: 1.42


	});
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

var layerList = document.getElementById('location-menu');
var inputs = layerList.getElementsByTagName('input');


function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/batch21/' + layerId);
}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}