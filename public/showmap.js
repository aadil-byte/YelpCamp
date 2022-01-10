// Map
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});
new mapboxgl.Marker({ color: 'black' })
.setLngLat(campground.geometry.coordinates)
.addTo(map);

// const popup = new mapboxgl.Popup({ closeOnClick: false , offset: 25 })
// .setLngLat(campground.geometry.coordinates)
// .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
// .addTo(map);
const popup = new mapboxgl.Popup({ offset: 25 }).setText(
`${campground.location}`
).addTo(map)
map.addControl(new mapboxgl.NavigationControl(), 'top-left');