// authMiddleware.js - Middleware som autentiserar JWT-token i inkommande förfrågningar
const jwt = require("jsonwebtoken");

// Middleware-funktion som autentiserar JWT-token
function authenticateToken(req, res, next) {
    // Hämta token från Authorization-headern
    const authHeader = req.headers["authorization"];
    // Token förväntas i formatet "Bearer <token>"
    const token = authHeader && authHeader.split(" ")[1];

    // Om ingen token finns, returnera 401 Unauthorized
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Verifiera token med hjälp av JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Om token är ogiltig, returnera 403 Forbidden
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        // Om token är giltig, spara användarinformationen i req.user och fortsätt till nästa middleware eller route handler
        req.user = user;
        next();
    });
}

// Exportera middleware-funktionen så att den kan användas i andra delar av applikationen
module.exports = authenticateToken;