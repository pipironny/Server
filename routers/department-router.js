const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

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
            res.send("Успешно добавлено");
        }
    });
});

router.put('/api/department/:id', (req, res)=>{
    const Upid = req.params.id;
    const name = req.body.name;

    connection.query('UPDATE `department` SET `name` = ? WHERE id =?',[name, Upid], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send(`Кафедра с id ${Upid} обновлена`);
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
            res.send("Удалено");
            //console.log(result);
        }
    });
});

module.exports = router;