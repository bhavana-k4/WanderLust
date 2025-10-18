mapboxgl.accessToken =mapToken;

const map=new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style:"mapbox://styles/mapbox/streets-v12", // style URL
    center:coordinates, // starting position [Ing, lat]
    zoom:7, // starting zoom
});

const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates) //Listing.geometry.coordinates;
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML("<h1>Hello World!</h1>"))
        .addTo(map);

