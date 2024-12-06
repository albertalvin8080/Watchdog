"use strict";

// Initializes map (the id of the div is "map")
const map = L.map("map");

// Sets initial coordinates and zoom level
map.setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
}).addTo(map);

let marker, circle, zoomed;

function onSuccess(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const acc = pos.coords.accuracy;

    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    marker = L.marker([lat, lng]).addTo(map);
    circle = L.circle([lat, lng], { radius: acc }).addTo(map);

    // maintain the zoom
    if (!zoomed)
        zoomed = map.fitBounds(circle.getBounds());

    // follow the marker
    map.setView([lat, lng]);
}

function onError(err) {
    if (err.code === 1) {
        alert("Please allow geolocation access.");
    } else {
        alert("Cannot get geolocation access.");
    }
}

navigator.geolocation.watchPosition(onSuccess, onError);