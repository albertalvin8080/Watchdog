"use strict";

class MapApp {
    constructor(divId) {
        this.map = L.map(divId);
        this.mapElement = document.querySelector("#map");
        this.marker = null;
        this.circle = null;
        this.zoomed = false;

        // Initialize the map
        this.map.setView([51.505, -0.09], 13);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(this.map);

        // Enable geolocation watch
        navigator.geolocation.watchPosition(
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );

        // Handle map clicks
        this.map.on("click", this.onMapClick.bind(this));
    }

    hideMap()
    {
        this.mapElement.style.display = "none";
    }

    showMap()
    {
        this.mapElement.style.display = "flex";
    }

    onSuccess(pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = pos.coords.accuracy;

        // Remove existing marker and circle if they exist
        if (this.marker) {
            this.map.removeLayer(this.marker);
            this.map.removeLayer(this.circle);
        }

        const myIcon = L.icon({
            iconUrl: "../assets/location-blue.png",
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
        });

        // Add new marker and circle
        this.marker = L.marker([lat, lng], { icon: myIcon }).addTo(this.map);
        this.circle = L.circle([lat, lng], { radius: acc, zIndexOffset: -1 }).addTo(this.map);

        // Adjust the zoom if needed
        if (!this.zoomed) {
            this.zoomed = true;
            this.map.fitBounds(this.circle.getBounds());
        }

        // Center the map on the marker
        this.map.setView([lat, lng]);
    }

    onError(err) {
        switch (err.code) {
            case 1: // PERMISSION_DENIED
                alert("Please allow geolocation access.");
                break;
            case 2: // POSITION_UNAVAILABLE
                console.log("err.code==2 -> POSITION_UNAVAILABLE");
                break;
            default:
                alert("Cannot get geolocation access.");
        }
    }

    onMapClick(e) {
        const latlng = e.latlng;
        const clickedMarker = L.marker(latlng).addTo(this.map);

        clickedMarker.bindPopup("You clicked here!").openPopup();

        // Remove the marker on click
        clickedMarker.on("click", () => {
            this.map.removeLayer(clickedMarker);
        });
    }
}

const mapApp = new MapApp("map");
