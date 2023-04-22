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

router.get("/api/subject", (req, res)=>{
    connection.query('SELECT * FROM `subject`', (err, result, fields) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

router.post('/api/subject', (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;

    connection.query('INSERT INTO `subject` VALUES(?,?)',[id, name], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("POSTES");
        }
    });
});

router.put('/api/subject/:id', (req, res)=>{
    const Upid = req.params.id;
    const name = req.body.name;

    connection.query('UPDATE `subject` SET `name` = ? WHERE id =?',[name, Upid], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send(`Subject with id ${Upid} has been updated`);
        }
    });
});

router.delete('/api/subject/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `subject` WHERE id=?',delId ,(err, result) =>{
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