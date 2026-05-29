// server.js - Denna fil startar Express-servern och definierar de olika API-rutterna.
// Ladda miljövariabler från .env-filen
require("dotenv").config();
// Importera nödvändiga moduler och rutter
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protection");

// Skapa en Express-applikation
const app = express();

// Middleware för att hantera CORS och JSON-kroppar i inkommande förfrågningar
app.use(cors());
app.use(express.json());

// Definiera API-rutter för autentisering och skyddade resurser
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

// Starta servern och lyssna på den angivna porten
app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});