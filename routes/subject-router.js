const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// Этот запрос API принимает GET-запрос и возвращает все дисциплины
router.get("/api/subject", (req, res)=>{
    connection.query('SELECT * FROM `subject`',
    (err, result, fields) =>{
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

// Этот запрос API принимает POST-запрос и добавляет дисциплину в базу данных
router.post('/api/subject', (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    connection.query('INSERT INTO `subject` VALUES(?,?,?)',
    [id, name, description], 
    (err, result) =>{
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

// Этот запрос API принимает PUT-запрос и изменяет данные [id] дисциплины в базе данных
router.put('/api/subject/:id', (req, res)=>{
    const Upid = req.params.id;
    const name = req.body.name;
    const description = req.body.description;

    connection.query('UPDATE `subject` SET `name` = ?, `description` = ? WHERE id =?',
    [name, description, Upid], 
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(`Предмет с id ${Upid} обновлен`);
        }
    });
});

// Этот запрос API принимает DELETE-запрос и удаляет данные [id] дисциплины из базы данных
router.delete('/api/subject/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `subject` WHERE id=?',delId ,
    (err, result) =>{
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