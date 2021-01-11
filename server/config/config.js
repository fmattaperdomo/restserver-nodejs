// =========================
//Puerto
// =========================

process.env.PORT = process.env.PORT || 3000;

// =========================
//Entorno
// =========================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// =========================
//Bases de Datos
// =========================
let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://192.168.247.141:27017/cafe";
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// =========================
//Vencimiento del token
//
// =========================
process.env.CADUCIDAD_TOKEN = "48h"; // 60 * 60 * 24 * 30;

// =========================
//Semilla de autenticación
// =========================

process.env.SEED = process.env.SEED || "secret-desarrollo";

// =========================
//Google Client iD
// =========================
process.env.CLIENT_ID =
    process.env.CLIENT_ID ||
    "236437743904-dvk5mp5m51amv1942t7afeeua1pc32rg.apps.googleusercontent.com";