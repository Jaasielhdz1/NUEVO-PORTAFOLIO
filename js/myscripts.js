// 1. CONFIGURACIÓN (Asegúrate de que la URL y KEY sean las correctas de tu panel)
const supabaseUrl = "https://lotspzcldkgmrwlbnvdu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvdHNwemNsZGtnbXJ3bGJudmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTM2MjIsImV4cCI6MjA4OTQyOTYyMn0.3_124Gp_ibfrRU-VsydWVzsvhOSsa8_ll6aaEgzgDZU";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 2. INICIALIZAR MAPA
const map = L.map("map").setView([25.58512, -103.495814], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 3. SELECCIÓN DE ELEMENTOS
const popup = document.querySelector(".popup");
const inputLat = document.querySelector(".latitude");
const inputLng = document.querySelector(".longitude");
const inputLoc = document.querySelector(".location");
const btnSave = document.querySelector(".Save");
const btnCancel = document.querySelector(".Cancel");

let markerTemp = null;

// --- FUNCIÓN PARA LEER DATOS ---
async function cargarPuntos() {
    const { data, error } = await supabaseClient.from("Coordinates").select("*");
    if (error) {
        console.error("Error al cargar puntos:", error.message);
        return;
    }
    data.forEach(p => {
        L.marker([p.latitude, p.longitude]).addTo(map).bindPopup(`<b>${p.location_name}</b>`);
    });
}

// Cargar al iniciar
cargarPuntos();

// --- LÓGICA DE INTERACCIÓN ---
map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    inputLat.value = lat;
    inputLng.value = lng;
    inputLoc.value = "";

    if (markerTemp) map.removeLayer(markerTemp);
    markerTemp = L.marker([lat, lng]).addTo(map);
    popup.showModal();
});

btnCancel.onclick = () => {
    popup.close();
    if (markerTemp) map.removeLayer(markerTemp);
};

// --- GUARDAR EN SUPABASE ---
btnSave.onclick = async () => {
    const nombre = inputLoc.value;
    const latitud = parseFloat(inputLat.value);
    const longitud = parseFloat(inputLng.value);

    if (!nombre) return alert("Escribe un nombre");

    const { error } = await supabaseClient
        .from("Coordinates")
        .insert([{ 
            location_name: nombre, 
            latitude: latitud, 
            longitude: longitud 
        }]);

    if (error) {
        alert("Error de Supabase: " + error.message);
    } else {
        alert("¡Guardado correctamente! ✅");
        popup.close();
        // Agregamos el marcador oficial y quitamos el temporal
        L.marker([latitud, longitud]).addTo(map).bindPopup(`<b>${nombre}</b>`);
        if (markerTemp) map.removeLayer(markerTemp);
    }
};