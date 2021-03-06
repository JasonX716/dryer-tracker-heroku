const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const router = express.Router();

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if(err) throw err;
    console.log("%c Server running", "color: green");
});

const db = mysql.createPool({
    user:'b7d041e9af2185',
    host:'eu-cdbr-west-03.cleardb.net',
    password:'bc309d98',
    database:'heroku_5acb364d76d1e35'
});

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));
app.use('/api', router);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post("/create", (req, res) => {
    const serialNumber = req.body.serialNumber;
    const buildDate = req.body.buildDate;
    const status = req.body.status;

    db.query(
        'INSERT INTO dryers (serialNumber, buildDate, status) VALUES (?,?,?)', [serialNumber, buildDate, status], (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send("values inserted");
        }
    }
    );
});

app.get("/dryers", (req, res) => {
    db.query('SELECT * FROM dryers', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


app.put("/update", (req, res) => {
    const id = req.body.id;
    const status = req.body.status;
    db.query(
     'UPDATE dryers SET status = ? WHERE id = ?',
     [status, id], 
     (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
})

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id
    db.query("DELETE FROM dryers WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    });
})
