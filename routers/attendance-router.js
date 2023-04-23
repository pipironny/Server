const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

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
            res.send("Успешно добавлено");
        }
    });
});

router.put('/api/attendance/:id', (req, res)=>{
    const Upid = req.params.id;
    const Student_id = req.body.Student_id;
    const Schedule_id = req.body.Schedule_id;
    const visit = req.body.visit;

    connection.query('UPDATE `attendance` SET `Student_id` = ?,`Schedule_id` = ?,`visit` = ? WHERE id =?',[Student_id, Schedule_id, visit, Upid], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send(`Запись с id ${Upid} обновлена`);
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
            res.send("Удалено");
            //console.log(result);
        }
    });
});

module.exports = router;