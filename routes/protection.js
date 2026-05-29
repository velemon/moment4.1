// protection.js - Skyddade rutter som kräver autentisering
const express = require("express");
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Skyddad rutt som kräver autentisering
router.get("/profile", authenticateToken, (req, res) => {
    // Här kan användarens profilinformation från databasen hämtas
    res.json({
        message: "Protected data access granted",
        user: req.user
    });
});

module.exports = router;