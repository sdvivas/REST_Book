const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

//Mysql
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root11',
    database: 'test1',
});

//route
app.get('/', (req, res) => {
    res.send('Welcome to my API-REST of a Book');
});


app.get('/books', (req, res) => {
    const sql = 'SELECT * FROM libro';

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Not result');
        }
    });
});

app.get('/books/:codigo', (req, res) => {
    const { codigo } = req.params;
    const sql = `SELECT * FROM libro WHERE codigo = ${codigo}`;
    connection.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not result');
        }
    });
});

app.post('/add', (req, res) => {
    const sql = 'INSERT INTO libro SET ?';

    const bookObj = {
        titulo: req.body.titulo,
        autor: req.body.autor,
        fecha_publicacion: req.body.fecha_publicacion,
        precio: req.body.precio,
        paginas: req.body.paginas
    };

    connection.query(sql, bookObj, error => {
        if (error) throw error;
        res.send('book added!');
    });
});

app.put('/update/:codigo', (req, res) => {
    const { codigo } = req.params;
    const { titulo, autor,fecha_publicacion,precio, paginas} = req.body;
    const sql = `UPDATE libro 
                    SET titulo = '${titulo}', autor='${autor}', fecha_publicacion = '${fecha_publicacion}', 
                                    precio=${precio}, paginas = ${paginas}
                     WHERE codigo =${codigo}`;
  
    connection.query(sql, error => {
      if (error) throw error;
      res.send('book updated!');
    });
  });

  app.delete('/delete/:codigo', (req, res) => {
    const { codigo } = req.params;
    const sql = `DELETE FROM libro WHERE codigo= ${codigo}`;
  
    connection.query(sql, error => {
      if (error) throw error;
      res.send('book deleted');
    });
  });

//Check connection
connection.connect(error => {
    if (error) throw error;
    console.log('DATABASE CONNECT');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));