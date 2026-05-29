// db.js - Hanterar databasanslutningen och tabellskapandet
const sqlite3 = require("sqlite3").verbose();

// Anslut till SQLite-databasen (skapas om den inte finns)
const db = new sqlite3.Database("./database.db");

// Skapa tabell för användare om den inte redan finns
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// Exportera databasanslutningen för användning i andra delar av applikationen
module.exports = db;