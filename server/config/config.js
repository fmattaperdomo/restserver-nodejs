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