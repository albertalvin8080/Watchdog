"use strict";

class MapApp {
    constructor(divId) {
        this.map = L.map(divId);
        this.mapElement = document.querySelector(`#${divId}`);
        this.marker = null;
        this.circle = null;
        this.zoomed = false;

        // [lat, lng], zoom 
        this.map.setView([51.5074, -0.1278], 2);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            attribution: "© OpenStreetMap",
        }).addTo(this.map);

        configureMenu(this);
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
            });
            // .openPopup(); // The popup is slight deslocated to the right.

            this.coords = { lat, lon, display_name, marker };

        } catch (error) {
            console.error("Error fetching geocoding data:", error);
            alert("Failed to fetch location data.");
        }

        this.showMap();
        this.showEntranceRegister();
    }

    async openEntranceView(entrance) {
        this.entrance = entrance;
        const latE = entrance.location.latitude;
        const lonE = entrance.location.longitude;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latE}&lon=${lonE}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (this.coords) {
                this.map.removeLayer(this.coords.marker);
            }

            let { lat, lon, display_name } = data;
            lat = parseFloat(latE);
            lon = parseFloat(lonE);

            this.map.setView([lat, lon], 15);
            const marker = L.marker([lat, lon]).addTo(this.map);

            marker.bindPopup(`📍 ${display_name}`, {
                maxWidth: 200,
                minWidth: 100,
            });

            this.coords = { lat, lon, display_name, marker };

        } catch (error) {
            console.error("Error fetching geocoding data:", error);
            alert("Failed to fetch location data.");
        }

        this.showMap();
        this.showMenu();
    }

    openLocationSelectorView(locationBar, resolve, condomMetadata) {
        locationBar.style.display = "flex";
        this.showMap();

        console.log(condomMetadata)
        if (condomMetadata.boundByCondom) {
            this.map.removeLayer(this.coords.marker);

            let [lat, lon] = [condomMetadata.condom.location.latitude, condomMetadata.condom.location.longitude];

            this.map.setView([lat, lon]);

            const radius = 500; // Radius in meters
            const circle = L.circle([lat, lon], {
                color: 'red',
                fillColor: '#0000FF',
                fillOpacity: 0.15,
                radius: radius,
            }).addTo(this.map);

            const customIcon = L.icon({
                iconUrl: '../assets/location-red.png', // path to your PNG image
                iconSize: [40, 41], // size of the icon [width, height]
                iconAnchor: [20, 41], // point of the icon which will correspond to marker's location [x, y]
                popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor [x, y]
            });

            // const marker = L.marker([lat, lon]).addTo(this.map);
            const marker = L.marker([lat, lon], { icon: customIcon }).addTo(this.map);

            this.condomMarker = { marker, circle, radius, lat, lon };
        }

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

                if (condomMetadata.boundByCondom) {
                    const contains = this.isPointInsideCircle(
                        this.condomMarker.lat,
                        this.condomMarker.lon,
                        lat,
                        lon,
                        this.condomMarker.radius
                    );
                    if (!contains) {
                        this.coords = null;
                        return;
                    }
                }

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

                if (condomMetadata.boundByCondom) {
                    const contains = this.isPointInsideCircle(
                        this.condomMarker.lat,
                        this.condomMarker.lon,
                        lat,
                        lon,
                        this.condomMarker.radius
                    );
                    if (!contains) {
                        this.coords = null;
                        return;
                    }
                }

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
            
            if (condomMetadata.boundByCondom) {
                this.coords.marker.addTo(this.map);
                this.map.removeLayer(this.condomMarker.circle);
                this.map.removeLayer(this.condomMarker.marker);
            }
        };
    }

    // Uses Haversine formula
    isPointInsideCircle(centerLat, centerLon, pointLat, pointLon, radius) {
        // Convert degrees to radians
        const toRadians = (degrees) => degrees * (Math.PI / 180);
    
        const R = 6371000; // Earth's radius in meters
    
        const dLat = toRadians(pointLat - centerLat);
        const dLon = toRadians(pointLon - centerLon);
    
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRadians(centerLat)) * Math.cos(toRadians(pointLat)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        const distance = R * c;
    
        return distance <= radius;
    }

    hideMap() {
        this.mapElement.style.display = "none";
    }

    showMap() {
        this.mapElement.style.display = "flex";
    }

    showMenu() {
        this.menuScreen.style.display = "flex";
    }

    hideMenu() {
        this.menuScreen.style.display = "none";
    }

    showEntranceRegister() {
        this.entranceRegisterBtn.style.display = "flex";
    }

    hideEntranceRegister() {
        this.entranceRegisterBtn.style.display = "none";
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