var mysql = require('mysql');
const express = require('express');
const app = express();
const path = require('path');
var url = require('url');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "register",
});

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Define a route
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/find', (req, res) => {
    res.render('find');
});
app.get('/viewAll', (req, res) => {
    res.render('viewAll');
});

app.get('/getAllRow', (req, res) => {
    pool.query('SELECT * FROM proregister',  (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);  // Send the results back as a JSON response
        }
    });


   
});


app.get('/getSelectdRow', (req, res) => {


    var q = url.parse(req.url, true).query;
    var ID = q.ID;

    // Use parameterized query to prevent SQL injection
    pool.query('SELECT * FROM proregister WHERE id = ?', [ID], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);  // Send the results back as a JSON response
        }
    });


   
});


app.get('/pro_register', (req, res) => {

    var q = url.parse(req.url, true).query;
    var fullname = q.fullname;
    var email = q.email;
    var pass = q.pass;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "register"
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "insert into proregister values(null,'" + fullname + "','" + email + "','" + pass + "')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Record Inserted");
        });
    });

    //var ans="Data recived "+fullname +" "+email+" "+pass;
    res.send("User Create");

    //res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});


app.get('/pro_login', (req, res) => {
    var q = url.parse(req.url, true).query;
    var email = q.email;
    var pass = q.pass;
    var userCount = 0;

    var output = "temp output";
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "register"
    });

    con.connect(function (err) {
        if (err) throw err;
        var sql = "select * from proregister where email='" + email + "' and pass='" + pass + "'";
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
            result.forEach((row) => {
                userCount++;
                console.log(userCount);
                // console.log(row['fullname']);
                // output = output + row['fullname'] + " ";
            });
            console.log("userCount");
            console.log(userCount);
            if (userCount >= 1) {
                res.send("Login OK");
            }
            else {
                res.send("Invalid Login");
            }
        });

    });

    // res.send(output);

});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});