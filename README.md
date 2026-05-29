# JWT Authentication API

Detta repository innehåller källkod för en REST-baserad webbtjänst byggd med Node.js och Express. API hanterar registrering av användarkonton, inloggning och autentisering med hjälp av JSON Web Tokens (JWT).

Lösningen är utvecklad som en del av kursmomentet om autentisering och säkerhet i webbaserade applikationer.

---

## Länk

En lokal version av API:et körs på:

http://localhost:3000/api/workexperience

---

## Funktioner

Följande funktionalitet finns implementerad:

- Registrering av användarkonton
- Inloggning med användarnamn och lösenord
- Hashning av lösenord med bcrypt
- JWT-baserad autentisering
- Skyddade resurser som kräver giltig JWT-token
- Parameteriserade SQL-frågor för att motverka SQL-injection
- Hantering av känsliga inställningar via .env-fil

---

## Databas

API använder en SQLite-databas.

Vid första uppstart skapas databasen automatiskt och innehåller följande tabell:

**users**

| **Fält**   | **Typ**                           | **Beskrivning**    |
| ---------- | --------------------------------- | ------------------ |
| id         | INTEGER PRIMARY KEY AUTOINCREMENT | Unikt användar-ID  |
| username   | TEXT UNIQUE                       | Användarnamn       |
| password   | TEXT                              | Hashat lösenord    |
| created_at | DATETIME                          | Registreringsdatum |

Databasen lagras lokalt i filen:

database.db

---

## Installation

1. Klona repositoryt
   git clone <repository-url>
2. Installera beroenden
   npm install
3. Skapa en .env-fil i projektets rotmapp
   PORT=3000
   JWT_SECRET=supersecretkey123
4. Starta servern
   node server.js

Servern startar då på:

http://localhost:3000

---

## API-användning

### Registrera användare

| Metod | Ändpunkt |  
| POST | /api/auth/register |

Skapar ett nytt användarkonto.

Exempel:

{
"username": "testuser",
"password": "password123"
}

Svar:

{
"message": "User created"
}

---

### Logga in

| Metod | Ändpunkt |  
| POST | /api/auth/login |

Loggar in användaren och returnerar en JWT-token.

Exempel:

{
"username": "testuser",
"password": "password123"
}

Svar:

{
"token": "eyJhbGciOiJIUzI1NiIs..."
}

---

### Hämta skyddad resurs

| Metod | Ändpunkt |  
| GET | /api/profile |

Denna route kräver en giltig JWT-token.

Authorization-header:

Authorization: Bearer <JWT_TOKEN>

Exempel på svar:

{
"message": "Protected data access granted",
"user": {
"id": 1,
"username": "testuser"
}
}

---

### Säkerhet

Följande säkerhetsåtgärder har implementerats:

- Lösenord lagras aldrig i klartext.
- bcrypt används för hashning av lösenord.
- JWT används för autentisering av användare.
- Skyddade routes kräver giltig JWT-token.
- Parameteriserade SQL-frågor används för att förhindra SQL-injection.
- Känsliga inställningar lagras i .env-fil.
- .env-filen exkluderas från versionshantering via .gitignore.