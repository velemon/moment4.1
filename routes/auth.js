// auth.js - Denna fil hanterar autentiseringsrelaterade API-rutter, inklusive registrering och inloggning av användare.
// Importera nödvändiga moduler
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

// Skapa en Express-router
const router = express.Router();

// Register - Denna rutt hanterar registrering av nya användare. Den tar emot ett användarnamn och lösenord, hash:ar lösenordet och sparar det i databasen
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // Kontrollera att både användarnamn och lösenord har skickats med i förfrågan
    if (!username || !password) {
        // Om något av fälten saknas, returnera en 400 Bad Request-status med ett felmeddelande
        return res.status(400).json({ message: "Missing fields" });
    }

    // Hasha lösenordet med bcrypt för att säkra det innan det sparas i databasen
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL-fråga för att infoga en ny användare i databasen
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    // Kör SQL-frågan med de angivna parametrarna (användarnamn och hash:at lösenord)
    db.run(sql, [username, hashedPassword], function (err) {
        if (err) {
            // Om det uppstår ett fel, t.ex. om användarnamnet redan finns (UNIQUE constraint), returnera en 409 Conflict-status med ett felmeddelande
            return res.status(409).json({ message: "User already exists" });
        }

        // Om användaren skapades framgångsrikt, returnera en 201 Created-status med ett framgångsmeddelande
        res.status(201).json({ message: "User created" });
    });
});

// Login - Denna rutt hanterar inloggning av befintliga användare. Den tar emot ett användarnamn och lösenord, verifierar dem och returnerar en JWT om inloggningen lyckas.
router.post("/login", (req, res) => {
    // Extrahera användarnamn och lösenord från förfrågans kropp
    const { username, password } = req.body;

    // Kontrollera att både användarnamn och lösenord har skickats med i förfrågan
    const sql = "SELECT * FROM users WHERE username = ?";

    // Kör SQL-frågan för att hämta användaren med det angivna användarnamnet
    db.get(sql, [username], async (err, user) => {
        // Om det uppstår ett fel eller om ingen användare hittas, returnera en 401 Unauthorized-status med ett felmeddelande
        if (err || !user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Jämför det angivna lösenordet med det hash:ade lösenordet som finns i databasen
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Om lösenorden inte matchar, returnera en 401 Unauthorized-status med ett felmeddelande
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Om inloggningen lyckas, skapa en JWT som innehåller användarens ID och användarnamn, och signera den med en hemlig nyckel från miljövariablerna. JWT:n kommer att vara giltig i 1 timme
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Returnera den skapade JWT:n i svaret som JSON
        res.json({ token });
    });
});

// Exportera routern så att den kan användas i server.js
module.exports = router;