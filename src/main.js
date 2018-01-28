require('leaflet/dist/leaflet.css');
require('./main.css');

const L = require('leaflet');
const overpass = require('query-overpass');
const osmtogeojson = require('osmtogeojson');

const DEFAULT_MAP_POSITION = {
    center: [53.9023, 27.5812],
    zoom: 11
};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const $map = document.getElementById('map');

const map = L.map($map, DEFAULT_MAP_POSITION);

const geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$('#pharmaces').onclick = () => {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne  = bounds.getNorthEast();

    overpass(`[out:json];node(${sw.lat},${sw.lng},${ne.lat},${ne.lng})[amenity=pharmacy];out;`, (err, result) => {
        if (err) {
            return alert(err);
        }

        L.geoJSON(result, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);
    });
}
