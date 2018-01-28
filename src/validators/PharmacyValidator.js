
function makePopupFooter(id, tags) {
    return (
        `----------------------------------<br/>` +
        `<a target="_blank" href="https://www.openstreetmap.org/node/${id}/history">Show history</a><br/>` +
        `<a target="_blank" href="http://level0.osmz.ru/?url=n${id}">Edit in level0</a><br/>`
    );
}

function getData() {
    return new Map([
        ['pharms', '[amenity=pharmacy];']
    ]);
};

function prepareData(data) {
    return data.get('pharms');
}

function getMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    });
}

function getPopupContent(feature, latlng) {
    console.log(feature)

    const { id, tags } = feature.properties;

    return (
        `<div><b>${id}</b><div>` +
        `${tags.name || ''}<br/>` +
        `ref: ${tags.ref || ''}<br/>` +
        `operator: ${tags.operator || ''}<br/>` +
        `brand: ${tags.brand || ''}<br/>` +
        makePopupFooter(id, tags)
    );
};

module.exports = {
    name: 'Аптеки',
    getData,
    prepareData,
    getMarker,
    getPopupContent,
};
