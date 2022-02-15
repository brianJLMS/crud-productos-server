const mysql = require("mysql");
const dotenv = require("dotenv");

let instance = null;

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("db" + " " + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM productos;";

        connection.query(query, (err, res) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(res);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async insertNewProduct(nombre, etiquetas) {
    try {
      const insertProductId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO productos(nombre) VALUES(?);";

        connection.query(query, [nombre], (err, res) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(res.insertId);
        });
      });

      const insertLabelIds = etiquetas.map(async (etiqueta) => {
        const insertLabelId = await new Promise((resolve, reject) => {
          const query =
            "INSERT INTO etiquetas(nombre, id_producto) VALUES(?,?);";

          connection.query(query, [etiqueta, insertProductId], (err, res) => {
            if (err) {
              reject(new Error(err.message));
            }
            resolve(res.insertId);
          });
        });
        console.log(insertLabelId);
      });
      console.log(insertProductId, insertLabelIds);

      return {
        producto: {
          id: insertProductId,
          nombre: nombre,
        },
        etiquetas: etiquetas,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductAndLabels(id) {
    id = parseInt(id, 10);
    try {
      const response1 = await new Promise((resolve, reject) => {
        const query = "DELETE FROM productos WHERE id_producto = ?;";

        connection.query(query, [id], (err, res) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(res.affectedRows);
        });
      });
      //la llave foranea "id_producto" de "etiquetas" posee ON DELETE CASCADE

      return {
        productDeleted: response1 === 1 ? true : false,
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = DbService;
