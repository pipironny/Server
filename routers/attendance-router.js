const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// Этот запрос API принимает GET-запрос и возвращает посещаемость студентов
router.get("/api/attendance/all", (req, res)=>{
    connection.query('SELECT * FROM `attendance`', 
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

/*
// Этот запрос API принимает GET-запрос и возвращает отношение посещенных пар к всем проведенным
router.get("/api/attendance/test", (req, res)=>{
    connection.query('SELECT SUM(total) AS totalClasses, SUM(attended) AS totalAttended FROM attendance_data', (err, result, fields) =>{
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
*/

// Этот запрос API принимает POST-запрос и добавляет студента в базу данных
router.post('/api/attendance', (req, res)=>{
    const id = req.body.id;
    const Student_id = req.body.Student_id;
    const Schedule_id = req.body.Schedule_id;
    const visit = req.body.visit;

    connection.query('INSERT INTO `attendance` VALUES(?,?,?,?)',
    [id, Student_id, Schedule_id, visit], 
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

// Этот запрос API принимает PUT-запрос и изменяет данные [id] студента в базе данных
router.put('/api/attendance/:id', (req, res)=>{
    const Upid = req.params.id;
    const Student_id = req.body.Student_id;
    const Schedule_id = req.body.Schedule_id;
    const visit = req.body.visit;

    connection.query('UPDATE `attendance` SET `Student_id` = ?,`Schedule_id` = ?,`visit` = ? WHERE id =?',
    [Student_id, Schedule_id, visit, Upid], 
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

// Этот запрос API принимает DELETE-запрос и удаляет данные [id] студента из базы данных
router.delete('/api/attendance/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `attendance` WHERE id=?',delId ,
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