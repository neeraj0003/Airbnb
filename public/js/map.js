
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // center: [78.008072, 27.176670], // starting position [lng, lat]
    center: listing.geometry.coordinates,
    zoom: 7 // starting zoom
});

// console.log(coordinates);

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)//listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({ offset: 25})
        // .setHTML(`<h5>${listing.location}</h5><p>Exact Location Provided After Booking!</p>`))
        .setHTML(`<h5>${listing.title}</h5><p><i>Exact Location will be Provided After Booking!</i></p>`))
    .addTo(map);
