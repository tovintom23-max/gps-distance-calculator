let CURRENT_LOCATION = null;
let A = null;
let B = null;

// Leaflet map variables
let map = null;
let currentMarker = null;
let accuracyCircle = null;

let markerA = null;
let markerB = null;
let routeLine = null;


// Main function
function main() {

    // Initialize the map
    initializeMap();

    if (navigator.geolocation) {

        navigator.geolocation.watchPosition(
            onLocationUpdate,
            onError,
            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 15000
            }
        );

        document.getElementById("status").innerHTML =
            "Getting your location...";

    } else {

        document.getElementById("status").innerHTML =
            "Geolocation is not supported by your browser.";

    }
}


// Initialize Leaflet map
function initializeMap() {

    if (typeof L === "undefined") {

        document.getElementById("status").innerHTML =
            "Map library could not load. Check your internet connection.";

        return;
    }

    // Initial map view
    map = L.map("map").setView([20, 0], 2);

    // OpenStreetMap tiles
    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ).addTo(map);

}


// Update current GPS location
function onLocationUpdate(event) {

    CURRENT_LOCATION = event.coords;

    const lat = CURRENT_LOCATION.latitude;
    const lon = CURRENT_LOCATION.longitude;
    const accuracy = CURRENT_LOCATION.accuracy;

    // Display current coordinates
    document.getElementById("loc").innerHTML =
        "Your Current Location:<br>" +
        "Lat: " + lat.toFixed(6) +
        "<br>Lon: " + lon.toFixed(6);

    // Display GPS accuracy
    document.getElementById("accuracy").innerHTML =
        "GPS Accuracy: approximately " +
        Math.round(accuracy) + " metres";

    document.getElementById("status").innerHTML =
        "Location detected successfully.";

    // Update map
    if (map) {

        const position = [lat, lon];

        // Create current location marker
        if (currentMarker === null) {

            currentMarker = L.circleMarker(position, {
                radius: 8,
                color: "#ffffff",
                weight: 2,
                fillColor: "#1677ff",
                fillOpacity: 1
            }).addTo(map);

            currentMarker.bindPopup("Your Current Location");

            // Center map on first GPS reading
            map.setView(position, 16);

        } else {

            currentMarker.setLatLng(position);

        }

        // Create or update GPS accuracy circle
        if (accuracyCircle === null) {

            accuracyCircle = L.circle(position, {
                radius: accuracy,
                color: "#1677ff",
                fillColor: "#1677ff",
                fillOpacity: 0.12,
                weight: 1
            }).addTo(map);

        } else {

            accuracyCircle.setLatLng(position);
            accuracyCircle.setRadius(accuracy);

        }

    }

}


// Better error handling
function onError(err) {

    let message = "";

    switch (err.code) {

        case 1:
            message =
                "Location permission denied. Allow location access in browser settings.";
            break;

        case 2:
            message =
                "Location unavailable. Check your GPS or internet connection.";
            break;

        case 3:
            message =
                "Location request timed out. Please try again.";
            break;

        default:
            message =
                "Unable to retrieve location: " + err.message;

    }

    document.getElementById("status").innerHTML = message;

}


// Create custom A and B map icons
function createPointIcon(letter, className) {

    return L.divIcon({

        className: "custom-map-icon",

        html:
            '<div class="' + className + '">' +
            letter +
            '</div>',

        iconSize: [32, 32],

        iconAnchor: [16, 16]

    });

}


// Save location A
function setA() {

    if (CURRENT_LOCATION === null) {

        document.getElementById("status").innerHTML =
            "Waiting for your GPS location. Try again.";

        return;
    }

    A = {
        latitude: CURRENT_LOCATION.latitude,
        longitude: CURRENT_LOCATION.longitude
    };

    updateInfo();

}


// Save location B
function setB() {

    if (CURRENT_LOCATION === null) {

        document.getElementById("status").innerHTML =
            "Waiting for your GPS location. Try again.";

        return;
    }

    B = {
        latitude: CURRENT_LOCATION.latitude,
        longitude: CURRENT_LOCATION.longitude
    };

    updateInfo();

}


// Update coordinates, distance and map markers
function updateInfo() {

    if (A !== null) {

        document.getElementById("aBtn").innerHTML =
            A.latitude.toFixed(4) +
            "<br>" +
            A.longitude.toFixed(4);

        document.getElementById("aBtn").classList.add("locFont");

    }

    if (B !== null) {

        document.getElementById("bBtn").innerHTML =
            B.latitude.toFixed(4) +
            "<br>" +
            B.longitude.toFixed(4);

        document.getElementById("bBtn").classList.add("locFont");

    }

    // Update map markers
    updateMapMarkers();

    // Calculate distance
    if (A !== null && B !== null) {

        let dist = getDistance(A, B);

        let distanceText;

        if (dist >= 1000) {

            distanceText =
                (dist / 1000).toFixed(2) + " km";

        } else {

            distanceText =
                Math.round(dist) + " metres";

        }

        document.getElementById("info").innerHTML =
            "Distance<br>----------------<br>" +
            distanceText;

        document.getElementById("status").innerHTML =
            "Distance calculated successfully.";

    }

}


// Update A and B markers and connecting line
function updateMapMarkers() {

    if (!map) {
        return;
    }

    // Add or update A marker
    if (A !== null) {

        const positionA = [A.latitude, A.longitude];

        if (markerA === null) {

            markerA = L.marker(positionA, {
                icon: createPointIcon("A", "marker-a")
            }).addTo(map);

            markerA.bindPopup("Location A");

        } else {

            markerA.setLatLng(positionA);

        }

    }

    // Add or update B marker
    if (B !== null) {

        const positionB = [B.latitude, B.longitude];

        if (markerB === null) {

            markerB = L.marker(positionB, {
                icon: createPointIcon("B", "marker-b")
            }).addTo(map);

            markerB.bindPopup("Location B");

        } else {

            markerB.setLatLng(positionB);

        }

    }

    // Draw line between A and B
    if (A !== null && B !== null) {

        const points = [
            [A.latitude, A.longitude],
            [B.latitude, B.longitude]
        ];

        if (routeLine !== null) {

            map.removeLayer(routeLine);

        }

        routeLine = L.polyline(points, {
            color: "#1677ff",
            weight: 4,
            dashArray: "8, 8"
        }).addTo(map);

        // Zoom map to show both locations
        const bounds = L.latLngBounds(points);

        if (getDistance(A, B) < 10) {

            map.setView(points[0], 17);

        } else {

            map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 16
            });

        }

    } else if (A !== null) {

        map.setView(
            [A.latitude, A.longitude],
            16
        );

    } else if (B !== null) {

        map.setView(
            [B.latitude, B.longitude],
            16
        );

    }

}


// Reset A and B
function resetLocations() {

    A = null;
    B = null;

    // Reset buttons
    document.getElementById("aBtn").innerHTML = "A";
    document.getElementById("bBtn").innerHTML = "B";

    document.getElementById("aBtn").classList.remove("locFont");
    document.getElementById("bBtn").classList.remove("locFont");

    // Reset distance
    document.getElementById("info").innerHTML =
        "Distance will appear here";

    // Remove map markers
    if (map) {

        if (markerA !== null) {
            map.removeLayer(markerA);
            markerA = null;
        }

        if (markerB !== null) {
            map.removeLayer(markerB);
            markerB = null;
        }

        if (routeLine !== null) {
            map.removeLayer(routeLine);
            routeLine = null;
        }

    }

    document.getElementById("status").innerHTML =
        "Locations reset. Select new locations.";

}


// Haversine formula
function getDistance(latlon1, latlon2) {

    const R = 6371000;

    const lat1 = degToRad(latlon1.latitude);
    const lat2 = degToRad(latlon2.latitude);

    const deltaLat = degToRad(
        latlon2.latitude - latlon1.latitude
    );

    const deltaLon = degToRad(
        latlon2.longitude - latlon1.longitude
    );

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) ** 2;

    // Protect against floating-point rounding
    const boundedA = Math.min(1, Math.max(0, a));

    const c = 2 * Math.atan2(
        Math.sqrt(boundedA),
        Math.sqrt(1 - boundedA)
    );

    return R * c;

}


// Convert degrees to radians
function degToRad(degree) {

    return degree * Math.PI / 180;

}