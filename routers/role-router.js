const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// Этот запрос API принимает GET-запрос и возвращает все роли
router.get("/api/role", (req, res)=>{
    connection.query('SELECT * FROM `role`', (err, result, fields) =>{
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

// Этот запрос API принимает POST-запрос и добавляет роль в базу данных
router.post('/api/role', (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;

    connection.query('INSERT INTO `role` VALUES(?,?)',
    [id, name], (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send("Роль успешно добавлена");
        }
    });
});

// Этот запрос API принимает PUT-запрос и изменяет данные [id] роли в базе данных
router.put('/api/role/:id', (req, res)=>{
    const Upid = req.params.id;
    const name = req.body.name;

    connection.query('UPDATE `role` SET `name` = ? WHERE id =?',
    [name, Upid], (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(`Роль с id ${Upid} обновлена`);
        }
    });
});

// Этот запрос API принимает DELETE-запрос и удаляет данные [id] роли из базы данных
router.delete('/api/role/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `role` WHERE id=?',delId ,(err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send("Роль удалена");
            //console.log(result);
        }
    });
});

module.exports = router;