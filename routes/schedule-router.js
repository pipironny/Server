const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// Этот запрос API принимает GET-запрос и возвращает все записи таблицы расписание
router.get("/api/schedule", (req, res)=>{
    connection.query('SELECT * FROM `schedule`', 
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

// Этот запрос API принимает POST-запрос и добавляет запись в базу данных
router.post('/api/schedule', (req, res)=>{
    const id = req.body.id;
    const Group_id = req.body.Group_id;
    const Employees_id = req.body.Employees_id;
    const Subject_id = req.body.Subject_id;
    const date = req.body.date;

    connection.query('INSERT INTO `schedule` VALUES(?,?,?,?,?)',
    [id, Group_id, Employees_id, Subject_id, date], 
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

// Этот запрос API принимает PUT-запрос и изменяет данные [id] записи таблицы расписание в базе данных
router.put('/api/schedule/:id', (req, res)=>{
    const Upid = req.params.id;
    const Group_id = req.body.Group_id;
    const Employees_id = req.body.Employees_id;// Err Cannot add or update a child row: a foreign key constraint fails (`serverbd`.`schedule`, CONSTRAINT `Subject_Employees` FOREIGN KEY (`Employees_id`) REFERENCES `employees` (`id`))
    const Subject_id = req.body.Subject_id;
    //const date = req.body.date;

    connection.query('UPDATE `schedule` SET `Group_id` = ?, `Employees_id` = ?, `Subject_id` = ? WHERE id =?',
    [Group_id, Employees_id, Subject_id, Upid], 
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(`Запись с id ${Upid} обновлена`);
        }
    });
});

// Этот запрос API принимает DELETE-запрос и удаляет данные [id] записи таблицы расписание из базы данных
router.delete('/api/schedule/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `schedule` WHERE id=?',delId ,
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