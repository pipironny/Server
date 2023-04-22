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

router.get("/api/attendance", (req, res)=>{
    connection.query('SELECT * FROM `attendance`', (err, result, fields) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

router.post('/api/attendance', (req, res)=>{
    const id = req.body.id;
    const Student_id = req.body.Student_id;
    const Schedule_id = req.body.Schedule_id;
    const visit = req.body.visit;

    connection.query('INSERT INTO `attendance` VALUES(?,?,?,?)',[id, Student_id, Schedule_id, visit], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("POSTES");
        }
    });
});

router.delete('/api/attendance/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `attendance` WHERE id=?',delId ,(err, result) =>{
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