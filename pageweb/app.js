const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const dbPath = "./users.json";

// Page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Enregistrement
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const db = JSON.parse(await fs.promises.readFile(dbPath));
  if (db.users.find(u => u.email === email)) {
    return res.status(400).send("Email déjà utilisé.");
  }
  db.users.push({ username, email, password });
  await fs.promises.writeFile(dbPath, JSON.stringify(db, null, 2));
  res.send("Inscription réussie !");
});

// Connexion
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = JSON.parse(await fs.promises.readFile(dbPath));
  const user = db.users.find(u => u.email === email && u.password === password);
  if (user) {
    res.send(`Bienvenue ${user.username} !`);
  } else {
    res.status(401).send("Email ou mot de passe incorrect.");
  }
});

app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
