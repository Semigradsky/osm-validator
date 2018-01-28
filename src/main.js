require('leaflet/dist/leaflet.css');
require('./main.css');

const L = require('leaflet');
const overpass = require('query-overpass');

const PharmacyValidator = require('./validators/PharmacyValidator');
// const pharms = require('./pharm.json');

const DEFAULT_MAP_POSITION = {
    center: [53.9023, 27.5812],
    zoom: 11
};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const $map = document.getElementById('map');

const map = L.map($map, DEFAULT_MAP_POSITION);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function renderValidatorSwitch(validatorName, handle) {
    const button = document.createElement('button');
    button.textContent = validatorName;
    button.onclick = handle;
    $('#validators').appendChild(button);
}

function getOverpassData(query) {
    return new Promise((resolve, reject) => {
        overpass(query, (err, result) => {
            err ? reject(err) : resolve(result);
        });
    });
}

[
    PharmacyValidator
].forEach((validator) => {
    renderValidatorSwitch(validator.name, () => {
        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne  = bounds.getNorthEast();

        Promise.all([...validator.getData()]
            .map(([key, query]) => {
                return getOverpassData(`[out:json];node(${sw.lat},${sw.lng},${ne.lat},${ne.lng})${query}out;`)
                    .then((data) => [key, data]);
            })
        )
            .then((allData) => validator.prepareData(new Map(allData)))
            .then((preparedData) => {
                L.geoJSON(preparedData, {
                    pointToLayer: (feature, latlng) => {
                        const popupContent = validator.getPopupContent(feature, latlng);
                        const popup = L.popup().setContent(popupContent);
                        return validator.getMarker(feature, latlng).bindPopup(popup);
                    }
                }).addTo(map);
            });

        // pharms.forEach((pharm) => {
        //     const latlng = L.latLng(pharm.lat, pharm.lon);

        //     if (!bounds.contains(latlng)) {
        //         return;
        //     }

        //     const popup = L.popup().setLatLng(latlng).setContent(pharm.id);
        //     L.circleMarker(latlng, {
        //         radius: 7,
        //         fillColor: "#5cbc20",
        //         color: "#000",
        //         weight: 1,
        //         opacity: 1,
        //         fillOpacity: 0.8
        //     }).addTo(map).bindPopup(popup);
        // });
    });
});
