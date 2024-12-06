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

    const myIcon = L.icon({
        iconUrl: "../assets/location-blue.png",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    marker = L.marker([lat, lng], { icon: myIcon }).addTo(map);
    circle = L.circle([lat, lng], { radius: acc, zIndexOffset: -1 }).addTo(map);

    // maintain the zoom
    if (!zoomed)
        zoomed = map.fitBounds(circle.getBounds());

    // follow the marker
    map.setView([lat, lng]);
}

function onError(err) {
    // console.log(err.code);
    /*
    Code 1: PERMISSION_DENIED — The user has denied permission for the geolocation request.
    Code 2: POSITION_UNAVAILABLE — The position of the device could not be determined.
    Code 3: TIMEOUT — The geolocation request timed out before a position could be determined.
    */
    if (err.code === 1) {
        alert("Please allow geolocation access.");
    } else if (err.code === 2) {
        console.log("err.code==2 -> POSITION_UNAVAILABLE");
    }
    else {
        alert("Cannot get geolocation access.");
    }
}

navigator.geolocation.watchPosition(onSuccess, onError);

map.on('click', function (e) {
    const latlng = e.latlng;  

    const clickedMarker = L.marker(latlng).addTo(map);

    clickedMarker.bindPopup("You clicked here!").openPopup();
    clickedMarker.on("click", (e) => {
        map.removeLayer(clickedMarker);
    });
});