const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT, () => console.log("App is running"));

app.get("/", (req, res) => {
  res.send("Bienvenido");
});

//CREATE PRODUCT
app.post("/insert", (req, res) => {
  const { nombre, etiquetas } = req.body;
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewProduct(nombre, etiquetas);

  result.then((data) => res.json(data)).catch((err) => console.log(err));
});

//READ PRODUCTS
app.get("/getAll", (req, res) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result.then((data) => res.json({ data })).catch((err) => console.log(err));
});

//DELETE PRODUCT
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const result = db.deleteProductAndLabels(id);

  result.then((data) => res.json({ data })).catch((err) => console.log(err));
});
