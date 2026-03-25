// 🔐 TOKEN MO
Cesium.Ion.defaultAccessToken =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZTcwNzJkMS1hODNhLTQxYjgtOGMwMS04NjgwYmEwZTNhMmUiLCJpZCI6NDA3MjAwLCJpYXQiOjE3NzQ0ODI0NjJ9.eVHqqVKYVwBpA3gEA0CdAPzuU6yc2ftRiXUSPQYk4Uw";

// 🌍 VIEWER
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  animation: true,
  timeline: true,
  baseLayerPicker: true
});

// 🌍 START VIEW
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(122, 13, 20000000)
});

viewer.scene.globe.enableLighting = true;

// 🌡 WEATHER
fetch("https://api.open-meteo.com/v1/forecast?latitude=14.6&longitude=120.9&current_weather=true")
.then(res => res.json())
.then(data => {
  document.getElementById("weather").innerText =
    "PH Temp: " + data.current_weather.temperature + "°C";
});

// 🌍 CLEAR FUNCTION (SAFE)
function clearMap() {
  viewer.entities.removeAll();
}

// 🌍 EARTHQUAKES (CLICKABLE)
function loadEarthquakes() {
  clearMap();

  fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
  .then(res => res.json())
  .then(data => {

    document.getElementById("earthquake").innerText =
      "Earthquakes: " + data.features.length;

    data.features.forEach(eq => {
      const c = eq.geometry.coordinates;
      const props = eq.properties;

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(c[0], c[1]),
        point: { pixelSize: 6, color: Cesium.Color.RED },
        name: "🌍 Earthquake",
        description: `
          <b>Place:</b> ${props.place}<br>
          <b>Magnitude:</b> ${props.mag}<br>
          <b>Time:</b> ${new Date(props.time)}
        `
      });
    });
  });
}

// ✈️ FLIGHTS (CLICKABLE + BOARD)
function loadFlights() {
  clearMap();

  fetch("https://opensky-network.org/api/states/all")
  .then(res => res.json())
  .then(data => {

    let html = "<b>Live Flights:</b><br>";

    data.states.slice(0, 100).forEach(f => {
      if (f[5] && f[6]) {

        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(f[5], f[6], 10000),
          point: { pixelSize: 4, color: Cesium.Color.CYAN },
          name: "✈ Flight",
          description: `
            <b>Callsign:</b> ${f[1]}<br>
            <b>Country:</b> ${f[2]}<br>
            <b>Velocity:</b> ${f[9]} m/s<br>
            <b>Altitude:</b> ${f[13]} m
          `
        });

        html += `${f[1]} (${f[2]})<br>`;
      }
    });

    document.querySelector(".bottom").innerHTML = `
      <h2>✈ AIRPORT BOARD</h2>
      ${html}
    `;

    document.getElementById("status").innerText = "✈ Flights Live";
  });
}

// 🌪 STORMS (CLICKABLE + TIME)
function loadStorms() {
  clearMap();

  const now = new Date();

  const storms = [
    { name: "Typhoon PH", lon: 125, lat: 14 },
    { name: "Pacific Storm", lon: 140, lat: 20 },
    { name: "Atlantic Storm", lon: -50, lat: 25 }
  ];

  storms.forEach(storm => {
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(storm.lon, storm.lat),
      ellipse: {
        semiMajorAxis: 400000,
        semiMinorAxis: 400000,
        material: Cesium.Color.BLUE.withAlpha(0.4)
      },
      name: "🌪 Storm",
      description: `
        <b>Name:</b> ${storm.name}<br>
        <b>Location:</b> ${storm.lat}, ${storm.lon}<br>
        <b>Date:</b> ${now.toLocaleDateString()}<br>
        <b>Time:</b> ${now.toLocaleTimeString()}
      `
    });
  });

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(122, 13, 4000000)
  });

  document.getElementById("status").innerText = "🌪 Storm Tracking Active";
}

// 🛰 SATELLITE
function loadSatellite() {
  viewer.imageryLayers.removeAll();

  viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg",
      maximumLevel: 6
    })
  );

  viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: "https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png",
      maximumLevel: 6
    })
  );

  document.getElementById("status").innerText = "🛰 Satellite Active";
}

// 🤖 AI SYSTEM
function increaseRisk() {
  const eq = document.getElementById("earthquake").innerText;

  if (eq.includes("100")) {
    document.getElementById("risk").innerText = "Risk Level: EXTREME";
  }
  else if (eq.includes("50")) {
    document.getElementById("risk").innerText = "Risk Level: HIGH";
  }
  else {
    document.getElementById("risk").innerText = "Risk Level: MEDIUM";
  }

  document.getElementById("status").innerText = "🤖 AI ANALYSIS RUNNING";
}