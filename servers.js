const express = require('express');
const path = require('path');
const dbConfig = require(path.join(__dirname, 'app/config/db.config.js'));
const cors = require("cors");
const mysql = require('mysql2');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Create connection to MYSQL-server
const connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database
});

// Open connection to MYSQL-server
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL server:', error);
    return;
  }

  console.log('Connected to MySQL server');
});

/*---CHECK DATA API
// get cities
app.get('/cities', (req, res) => {
    const city = req.params.city;

  connection.query(`SELECT * FROM cities`, (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Error executing query' });
    }

    // result to json
    res.json(results);
  });
});

// get products
app.get('/products', (req, res) => {
    const product = req.params.productM;

    connection.query(`SELECT * FROM products`, (error, results, fields) => {
        if (error){
            console.error('Error executing query:', error);
            return res.status(500).json({error: 'Error executing query'});
        }

        // result to json
        res.json(results);
    })
});

// GET products that different cities offers
app.get('/city_products', (req, res) => {
    const product = req.params.productM;

    connection.query(`SELECT * FROM city_products`, (error, results, fields) => {
        if (error){
            console.error('Error executing query:', error);
            return res.status(500).json({error: 'Error executing query'});
        }

        // result to json
        res.json(results);
    })
});

// Skapa en endpoint som hämtar data från MySQL-servern
app.get('/products/:city/:product', (req, res) => {
    const city = req.params.city;
    const product = req.params.product;

  connection.query(`SELECT * FROM city_products WHERE city_id='${city}' AND product_id='${type}'`, (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Error executing query' });
    }

    // result to json
    res.json(results);
  });
});
---FINISH*/


app.get("/", (req, res) => {
    res.render('index');
  });


  app.get('/city/:city_name', function(req, res) {
  // Hämta data från databasen
  connection.query('SELECT products.product_id, products.product_name, products.product_price, cities.sqr_price, cities.city_id FROM products INNER JOIN city_products ON products.product_id = city_products.product_id INNER JOIN cities ON cities.city_id = city_products.city_id WHERE cities.city_name = ?', [req.params.city_name], function(err, rows) {
    if (err) {
      console.log(err);
      return res.status(500).send('Database error');
    }

    if (rows.length === 0) {
      return res.render('error', {message: 'Staden hittades inte i databasen.'});
    }

    // Rendera vyn med data
    res.render('productsInCity', {city_name: req.params.city_name, city_id: rows[0].city_id, products: rows});
  });
  });

  app.post('/submit', function(req, res) {
    var products = req.body.products || [];
    var square_meters = req.body.square_meters || 0;
    var id = req.body.city_id;
    var selectedProducts = products.map(function(product) {
      return {
        name: product.product_name,
        price: product.product_price
      };
    });

  //GET SQR PRICE FROM DB USING VAR ID AND THEN CALCULATE THE PRICE BY ADDING SELECTED PRDOUCTS PRICES AND THE TOTAL COST FOR THE SQUARMETER COST.
  
  console.log('Form data:', req.body); // Logga formulärdata till konsolen

    res.render('confirmation', {products: products, square_meters: square_meters});
  });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});