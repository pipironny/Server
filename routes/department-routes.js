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



router.get("/api/department", (req, res)=>{
    connection.query('SELECT * FROM `department`', (err, result, fields) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

router.post('/api/department', (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;

    connection.query('INSERT INTO `department` VALUES(?,?)',[id, name], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("POSTES");
        }
    });
});

router.delete('/api/department/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `department` WHERE id=?',delId ,(err, result) =>{
        if (err){
            return console.error("Ошибка подключения" + err.message);
        }
        else{
            res.send("DELETED");
            //console.log(result);
        }
    });
});

module.exports = router;