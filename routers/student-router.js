const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// Этот запрос API принимает GET-запрос и возвращает всех студентов
router.get("/api/student", (req, res)=>{
    connection.query('SELECT * FROM `student`', (err, result, fields) =>{
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

// Этот запрос API принимает POST-запрос и добавляет студента в базу данных
router.post('/api/student', (req, res)=>{
    const id = req.body.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const patronymic = req.body.patronymic;
    const studID_number = req.body.studID_number;
    const Group_id = req.body.Group_id;
    const course_id = req.body.course_id;

    connection.query('INSERT INTO `student` VALUES(?,?,?,?,?,?,?)',
    [id, first_name, last_name, patronymic, studID_number, Group_id, course_id], (err, result) =>{
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
router.put('/api/student/:id', (req, res)=>{
    const Upid = req.params.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const patronymic = req.body.patronymic;
    const studID_number = req.body.studID_number;
    const course_id = req.body.course_id;
    //const Group_id = req.body.Group_id;
    //,`Group_id` = ?

    connection.query('UPDATE `student` SET `first_name` = ?,`last_name` = ?,`patronymic` = ?,`studID_number` = ?,`course_id` = ? WHERE id =?',
    [first_name, last_name, patronymic, studID_number, course_id, Upid], (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(`Студент с id ${Upid} обновлен`);
        }
    });
});

// Этот запрос API принимает DELETE-запрос и удаляет данные [id] студента из базы данных
router.delete('/api/student/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `student` WHERE id=?',delId ,(err, result) =>{
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