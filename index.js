const express = require("express");
const app = express();
const connection = require("./conf");

const bodyParser = require("body-parser");
// Support JSON-encoded bodies
app.use(bodyParser.json());
// Support URL-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// 1- GET - Récupération de l'ensemble des données de ta table
app.get("/api/data", (req, res) => {
  connection.query("SELECT * from quest", (err, rows) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des donnees");
    } else {
      res.json(rows);
    }
  });
});
// 2- GET (light) - Récupération de quelques champs spécifiques (names, dates)
app.get("/api/data-light", (req, res) => {
  connection.query("SELECT name_quest,date_quest from quest", (err, rows) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des donnees");
    } else {
      res.json(rows);
    }
  });
});

// GET - Récupération d'un ensemble de données en fonction de certains filtres
// 3- Un filtre "contient ..."

app.get("/api/data/contient-sql/", (req, res) => {
  connection.query(
    "SELECT name_quest FROM quest WHERE name_quest LIKE '%QL%' ",
    (err, rows) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des donnees");
      } else {
        res.json(rows);
      }
    }
  );
});
// 4- Un filtre "commence par ..."

app.get("/api/data/begin/", (req, res) => {
  connection.query(
    "SELECT name_quest FROM quest WHERE name_quest LIKE 'exp%' ",
    (err, rows) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des donnees");
      } else {
        res.json(rows);
      }
    }
  );
});

// 5 Un filtre "supérieur à ...
app.get("/api/data/2019/", (req, res) => {
  connection.query(
    "SELECT name_quest, DATE_FORMAT(date_quest, '%d/%m/%Y') AS dateF FROM quest WHERE DATEDIFF( date_quest, '2019-01-01') > 0 ",
    (err, rows) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des donnees");
      } else {
        res.json(rows);
      }
    }
  );
});

// 6 - GET - Récupération de données ordonnées (ascendant, descendant)
app.get("/api/data/:ordre", (req, res) => {
  const ordre = req.params.ordre;
  connection.query(
    `SELECT name_quest, DATE_FORMAT(date_quest, '%d/%m/%Y') AS dateF FROM quest ORDER BY name_quest ${ordre}`,
    (err, rows) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des donnees");
      } else {
        res.json(rows);
      }
    }
  );
});

// 7 - POST - Sauvegarde d'une nouvelle entité
app.post("/api/data/new-quest", (req, res) => {
  const formData = req.body;
  connection.query("INSERT INTO quest SET ?", formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde d'une quete");
    } else {
      res.sendStatus(200);
    }
  });
});

// 8 - PUT - Modification d'une entité
app.put("/api/data/quest/:id", (req, res) => {
  const idQuest = req.params.id;
  const formData = req.body;

  connection.query(
    "UPDATE quest SET ? WHERE id = ?",
    [formData, idQuest],
    err => {
      if (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la modification d'une quete");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// 9 - PUT - Toggle du booléen
app.put("/api/data/toggle/:id", (req, res) => {
  const idQuest = req.params.id;
  connection.query(
    "UPDATE quest SET isCompleted = not isCompleted WHERE id = ?",
    [idQuest],
    err => {
      if (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la modification d'une quete");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// 10 - DELETE - Suppression d'une entité
app.delete("/api/data/delete-quest/:id", (req, res) => {
  const idQuest = req.params.id;
  connection.query("DELETE FROM quest WHERE id = ?", [idQuest], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'une quete");
    } else {
      res.sendStatus(200);
    }
  });
});

// 11 - DELETE - Suppression de toutes les entités dont le booléen est false
app.delete("/api/data/delete-false", (req, res) => {
  connection.query("DELETE FROM quest WHERE isCompleted = 0", err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'une quete");
    } else {
      res.sendStatus(200);
    }
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
