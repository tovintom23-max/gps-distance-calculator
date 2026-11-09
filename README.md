# GPS Distance Calculator

A GPS-based distance calculator built using HTML, CSS, JavaScript, and Leaflet. The application uses the browser's Geolocation API to capture geographical coordinates and calculate the distance between two selected locations.

## Features

- Real-time GPS location tracking.
- Capture two geographical locations using A and B buttons.
- Display latitude and longitude.
- Calculate distance using the Haversine formula.
- Display GPS accuracy in metres.
- Interactive map using Leaflet and OpenStreetMap.
- Display markers for locations A and B.
- Draw a connecting line between selected locations.
- Reset functionality to clear saved locations.
- Responsive user interface.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser Geolocation API
- Leaflet.js
- OpenStreetMap

## How to Use

1. Open the application in a supported browser.
2. Allow location access when prompted.
3. Wait for your current coordinates to appear.
4. Press **A** to save your first location.
5. Move to another location.
6. Press **B** to save your second location.
7. View the calculated distance and both markers on the map.
8. Press **Reset** to start a new calculation.

## Distance Calculation

The application uses the Haversine formula to calculate the great-circle distance between two geographical coordinates on Earth.

## Project Structure

```text
GPS-Distance-Calculator/
│
├── index.html
├── script.js
├── style.css
└── README.md
```

## Important Notes

- Location access requires user permission.
- Geolocation requires HTTPS or localhost.
- GPS accuracy depends on the device and its positioning services.
- An internet connection is required to load map tiles.

## Future Improvements

- Add walking and driving route navigation.
- Add location search.
- Display distance in different units.
- Save previously selected locations.

## Author

**Tovin Tom**

GitHub: https://github.com/tovintom23-max