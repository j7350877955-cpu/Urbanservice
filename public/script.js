let map;
let markers = {}; // To keep track of markers and move them smoothly

// --- 1. Your Custom Ratings (Decided by You) ---
const customRatings = {
    "Anuj Pawar": "⭐ 4.8",
    "John Doe": "⭐ 4.7",
    "Default": "⭐ 4.5"
};

function initMap() {
    map = L.map('map').setView([28.61, 77.20], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    // Start the Live Tracking Loop (Updates every 5 seconds)
    setInterval(loadWorkers, 5000); 
    loadWorkers();
}

async function loadWorkers() {
    try {
        const res = await fetch('/api/workers');
        const data = await res.json();
        
        data.forEach(w => {
            const rating = customRatings[w.name] || customRatings["Default"];
            
            if (markers[w.phone]) {
                // Move existing marker smoothly
                markers[w.phone].setLatLng([w.lat, w.lng]);
            } else {
                // Create new marker if it doesn't exist
                const marker = L.marker([w.lat, w.lng]).addTo(map)
                    .bindPopup(`<b>${w.name}</b><br>${w.service}<br><b style="color:#f59e0b;">${rating}</b>`);
                markers[w.phone] = marker;
            }
        });
    } catch (e) { console.log("Tracking error", e); }
}

// --- 2. LIVE LOCATION PING (For the Worker's Phone) ---
// This function should be triggered when a worker "Starts" their shift
function startLiveTracking(workerPhone) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            fetch('/api/worker/update-location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: workerPhone, lat, lng })
            });
            console.log("Location pinged to server:", lat, lng);
        }, (err) => console.log(err), {
            enableHighAccuracy: true
        });
    }
}
