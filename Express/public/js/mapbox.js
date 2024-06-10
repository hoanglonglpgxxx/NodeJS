
/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoibWl0c25lIiwiYSI6ImNseDhyNjBucjB3YzUybHB4cmNveGxheWMifQ.9465nhraP9TKEXQOrUkw_A';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mitsne/clx8rf13g01xi01qx70029p09',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(l => {
    const el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(l.coordinates).addTo(map);

    el.addEventListener('click', () => { });
    new mapboxgl.Popup({
        offset: 30
    }).setLngLat(l.coordinates).setHTML(`<p>Day ${l.day}: ${l.description}</p>`).addTo(map);

    bounds.extend(l.coordinates);
    const buttons = document.getElementsByClassName('mapboxgl-popup-close-button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].blur();
    }
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});