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
    }

    openMap() {
        this.showMap();
    }

    async openCondominiumView(condom) {
        this.condom = condom;
        const latC = condom.location.latitude;
        const lonC = condom.location.longitude;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latC}&lon=${lonC}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (this.coords) {
                this.map.removeLayer(this.coords.marker);
            }

            let { lat, lon, display_name } = data;
            lat = parseFloat(latC);
            lon = parseFloat(lonC);

            this.map.setView([lat, lon], 15);
            const marker = L.marker([lat, lon]).addTo(this.map);

            marker.bindPopup(`📍 ${display_name}`, {
                maxWidth: 200,
                minWidth: 100,
            })
            // .openPopup(); // The popup is slight deslocated to the right.

            this.coords = { lat, lon, display_name, marker };

        } catch (error) {
            console.error("Error fetching geocoding data:", error);
            alert("Failed to fetch location data.");
        }

        this.showMap();
    }

    openLocationSelectorView(locationBar, resolve) {
        locationBar.style.display = "flex";
        this.showMap();

        const btnCancel = locationBar.querySelector("#btnCancel");
        const btnConfirm = locationBar.querySelector("#btnConfirm");
        const inputSearch = locationBar.querySelector("#inputSearch");
        const btnSearch = locationBar.querySelector("#btnSearch");

        const handleCancel = (evt) => {
            cleanup();
            resolve(false);
        };

        const handleConfirm = (evt) => {
            cleanup();
            resolve(this.coords);
        };

        const handleSearch = async (evt) => {
            const strAddress = inputSearch.value.trim();
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(strAddress)}`;
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (this.coords) {
                    this.map.removeLayer(this.coords.marker);
                }

                if (data.length === 0) {
                    alert("Address not found.");
                    this.map.setView([51.5074, -0.1278], 2);
                    return;
                }

                let { lat, lon, display_name } = data[0];
                lat = parseFloat(lat);
                lon = parseFloat(lon);

                this.map.setView([lat, lon], 15);
                const marker = L.marker([lat, lon]).addTo(this.map);
                marker.bindPopup(`📍 ${display_name}`, {
                    maxWidth: 200,
                    minWidth: 100,
                }).openPopup();

                this.coords = { lat, lon, display_name, marker };

            } catch (error) {
                console.error("Error fetching geocoding data:", error);
                alert("Failed to fetch location data.");
            }
        };

        const handleMapClick = async (evt) => {
            const latlng = evt.latlng;
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`;
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (this.coords) {
                    this.map.removeLayer(this.coords.marker);
                }

                let { lat, lon, display_name } = data;
                lat = parseFloat(latlng.lat);
                lon = parseFloat(latlng.lng);

                this.map.setView([lat, lon]);
                const marker = L.marker([lat, lon]).addTo(this.map);
                marker.bindPopup(`📍 ${display_name}`, {
                    maxWidth: 200,
                    minWidth: 100,
                }).openPopup();

                // Put the address name in the input.
                inputSearch.value = display_name;

                this.coords = { lat, lon, display_name, marker };

            } catch (error) {
                console.error("Error fetching geocoding data:", error);
                alert("Failed to fetch location data.");
            }
        };

        const handleInputSearchEnter = (evt) => {
            if (evt.key === "Enter") {
                evt.preventDefault();
                btnSearch.click();
            }
        }

        btnCancel.addEventListener("click", handleCancel);
        btnConfirm.addEventListener("click", handleConfirm);
        btnSearch.addEventListener("click", handleSearch);
        inputSearch.addEventListener("keydown", handleInputSearchEnter)
        this.map.on("click", handleMapClick);

        const cleanup = () => {
            locationBar.style.display = "none";
            this.hideMap();

            btnCancel.removeEventListener("click", handleCancel);
            btnConfirm.removeEventListener("click", handleConfirm);
            btnSearch.removeEventListener("click", handleSearch);
            inputSearch.removeEventListener("keydown", handleInputSearchEnter);
            this.map.off("click", handleMapClick);
        };
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
mapApp.hideMap();