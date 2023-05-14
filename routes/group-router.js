const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// Этот запрос API принимает GET-запрос и возвращает все группы
router.get("/api/group", (req, res)=>{
    connection.query('SELECT * FROM `group`', 
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

// Этот запрос API принимает POST-запрос и добавляет группу в базу данных
router.post('/api/group', (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;

    connection.query('INSERT INTO `group` VALUES(?,?)',
    [id, name], 
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

// Этот запрос API принимает PUT-запрос и изменяет данные [id] группы в базе данных
router.put('/api/group/:id', (req, res)=>{
    const Upid = req.params.id;
    const name = req.body.name;

    connection.query('UPDATE `group` SET `name` = ? WHERE id =?',
    [name, Upid], 
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(`Группа с id ${Upid} обновлена`);
        }
    });
});

// Этот запрос API принимает DELETE-запрос и удаляет данные [id] группы из базы данных
router.delete('/api/group/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `group` WHERE id=?',delId ,
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