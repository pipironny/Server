const express = require('express');
const mysql = require("mysql2");

const router = express.Router();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

connection.connect(function(err){
    if (err){
        return console.error("Ошибка подключения " + err.message);
    }
    else{
        console.log("Соединение с сервером MySQL успешно установлено ");
    }
});

router.get("/api/schedule", (req, res)=>{
    connection.query('SELECT * FROM `schedule`', (err, result, fields) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

router.post('/api/schedule', (req, res)=>{
    const id = req.body.id;
    const Group_id = req.body.Group_id;
    const Employees_id = req.body.Employees_id;
    const Subject_id = req.body.Subject_id;
    const date = req.body.date;

    connection.query('INSERT INTO `schedule` VALUES(?,?,?,?,?)',[id, Group_id, Employees_id, Subject_id, date], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("POSTES");
        }
    });
});

router.delete('/api/schedule/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `schedule` WHERE id=?',delId ,(err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("DELETED");
            //console.log(result);
        }
    });
});

module.exports = router;