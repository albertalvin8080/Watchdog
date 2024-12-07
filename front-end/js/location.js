"use strict";

class MapApp {
    constructor(divId) {
        this.map = L.map(divId);
        this.mapElement = document.querySelector("#map");
        this.marker = null;
        this.circle = null;
        this.zoomed = false;

        // [lat, lng], zoom 
        this.map.setView([51.5074, -0.1278], 2);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            attribution: "© OpenStreetMap"
        }).addTo(this.map);

        // Handle map clicks
        this.map.on("click", this.onMapClick.bind(this));
    }

    openLocationSelector(locationBar, resolve) {
        locationBar.style.display = "flex";
        this.showMap();

        const btnCancel = locationBar.querySelector("#btnCancel");
        btnCancel.addEventListener("click", (evt) => {
            locationBar.style.display = "none";
            this.hideMap();
            resolve(false);
        });
        const btnConfirm = locationBar.querySelector("#btnConfirm");
        btnConfirm.addEventListener("click", (evt) => {
            locationBar.style.display = "none";
            this.hideMap();
            resolve(this.coords);
        });

        const inputSearch = locationBar.querySelector("#inputSearch");
        const btnSearch = locationBar.querySelector("#btnSearch");
        btnSearch.addEventListener("click", async (evt) => {
            const strAddress = inputSearch.value.replace(/^\s+|\s+$/g, "");
            // console.log(strAddress);
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(strAddress)}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.length === 0) {
                    alert("Address not found.");
                    return;
                }

                if (this.coords) {
                    // Remove previously marked point.
                    this.map.removeLayer(this.coords.marker);
                }

                // Get the first result
                // WARNING: Do NOT change these names;
                let { lat, lon, display_name } = data[0];
                lat = parseFloat(lat);
                lon = parseFloat(lon);
                // Update the map
                mapApp.map.setView([lat, lon], 15);

                // Add a marker with a popup
                const marker = L.marker([lat, lon]).addTo(mapApp.map);
                marker.bindPopup(`📍 ${display_name}`).openPopup();

                this.coords = { lat, lng: lon, display_name, marker };

            } catch (error) {
                console.error("Error fetching geocoding data:", error);
                alert("Failed to fetch location data.");
            }
        });
    }

    hideMap() {
        this.mapElement.style.display = "none";
    }

    showMap() {
        this.mapElement.style.display = "flex";
    }

    watchGeolocation() {
        // Enable geolocation watch
        navigator.geolocation.watchPosition(
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }
    onSuccess(pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.lnggitude;
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
        clickedMarker.on("click", (e) => {
            this.map.removeLayer(clickedMarker);
        });
    }
}

const mapApp = new MapApp("map");
