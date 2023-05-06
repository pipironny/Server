const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// Этот запрос API принимает GET-запрос и возвращает все кафедры
router.get("/api/department", (req, res)=>{
    connection.query('SELECT * FROM `department`', (err, result, fields) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

// Этот запрос API принимает POST-запрос и добавляет кафедру в базу данных
router.post('/api/department', (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;

    connection.query('INSERT INTO `department` VALUES(?,?)',
    [id, name], (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send("Успешно добавлено");
        }
    });
});

// Этот запрос API принимает PUT-запрос и изменяет данные [id] кафедры в базе данных
router.put('/api/department/:id', (req, res)=>{
    const Upid = req.params.id;
    const name = req.body.name;

    connection.query('UPDATE `department` SET `name` = ? WHERE id =?',
    [name, Upid], (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(`Кафедра с id ${Upid} обновлена`);
        }
    });
});

// Этот запрос API принимает DELETE-запрос и удаляет данные [id] кафедры из базы данных
router.delete('/api/department/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `department` WHERE id=?',delId ,(err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send("Удалено");
            //console.log(result);
        }
    });
});

module.exports = router;