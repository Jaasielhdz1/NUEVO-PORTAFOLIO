// 🔑 CONEXIÓN CON TU NUEVO PROYECTO ACTIVO
const supabaseClient = supabase.createClient(
    "https://lotspzcldkgmrwlbnvdu.supabase.co", // URL de tu proyecto actual
    "sb_publishable_QqSHElhJ3FFMHJuRLmQfeQ_SvIQN126" // Tu llave pública
);

// ... (el resto del código de inicialización del mapa se queda igual)

// 💾 FUNCIÓN ACTUALIZADA PARA GUARDAR
buttonSave.addEventListener("click", async () => {
    const lat = inputLatitude.value;
    const lng = inputLongitude.value;
    const loc = inputLocation.value;

    console.log("Guardando en la nueva tabla...");

    const { data, error } = await supabaseClient.from("Coordinates").insert([
        {
            location_name: loc,
            latitude: parseFloat(lat), // Convertimos a número para coincidir con float8
            longitude: parseFloat(lng) // Convertimos a número para coincidir con float8
        }
    ]);

    if (error) {
        console.error("Error:", error.message);
        alert("Error al guardar ❌: " + error.message);
    } else {
        alert("¡Ubicación guardada con éxito! ✅");
        popup.close();
        // Opcional: refresca la página para ver que no hay errores
    }
});