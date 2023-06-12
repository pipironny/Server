const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// 2 Страница группы, по id группы:
router.get('/api/group_page/:id', requireAuthAndRole, (req, res)=>{
    const id = req.params.id;

    const body = {
        schedule: {
            
        },
        attendance: {

        },
        students: {

        },
        subjects: {
            
        }
    };

    // Последние пары (id, дата, дисциплина, пара, аудитория);
    connection.query('SELECT id, date, subject_id, number, classroom_id FROM `schedule` WHERE group_id=?',id ,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            body.schedule = result;
        }
    });

    // Общая посещаемость группы по всем дисциплинам;
    connection.query('SELECT (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) / COUNT(*) * 100) AS overall_attendance_percentage FROM `attendance` JOIN students ON attendance.student_id = students.id WHERE group_id=?',id ,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            body.attendance = result;
        }
    });
    
     // Студенты этой группы(id, ФИО и посещаемость);
     connection.query('SELECT students.id, students.first_name, students.last_name, students.patronymic,(SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 END) / COUNT(*)) * 100 AS attendance_percentage FROM `students` JOIN attendance ON students.id = attendance.student_id WHERE students.group_id=?',id ,
     (err, result) =>{
         if (err){
             console.error("Ошибка подключения " + err.message);
             res.status(500).send('Internal Server Error');
             return;
         }
         else{
             body.students = result;
         }
     });

     // Дисциплины, к которым привязана группа(id, Название и посещаемость этой дисциплины этой группой).
     connection.query('SELECT subjects.id, subjects.name, groups.id, groups.name, (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) / COUNT(*) * 100) AS attendance_percentage FROM `schedule` JOIN subjects  ON `schedule`.subject_id = subjects.id JOIN groups ON `schedule`.group_id = groups.id JOIN attendance ON `schedule`.id = attendance.schedule_id WHERE group_id = ?',id ,
     (err, result) =>{
         if (err){
             console.error("Ошибка подключения " + err.message);
             res.status(500).send('Internal Server Error');
             return;
         }
         else{
             body.subjects = result;
         }
     });

});

// 3 Страница посещаемости группы по определенной дисциплине, по id группы и дисциплины:
router.get('/api/attendance_page/:group_id/:subject_id', requireAuthAndRole, (req, res)=>{
    const group_id = req.params.group_id; // id группы
    const subject_id = req.params.subject_id;// id дисциплины

    connection.query('SELECT `schedule`.`id`, `schedule`.`date`, `schedule`.`number`, subjects.name AS subject_name, students.first_name, students.last_name, students.patronymic, (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 END) / COUNT(*)) * 100 AS attendance_percentage FROM `schedule` JOIN subjects ON `schedule`.`subject_id`= subjects.id JOIN attendance ON `schedule`.`id` = attendance.schedule_id JOIN students ON `attendance`.`student_id` = students.id WHERE `schedule`.group_id = ? AND `schedule`.subject_id = ?',group_id , subject_id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(result);
        }
    });
});

// 4 Страница отметки посещаемость конкретной пары, по id занятия:
router.get('/api/subject_page/:id/', requireAuthAndRole, (req, res)=>{
    const id = req.params.id; 
    
    connection.query('SELECT students.id AS student_id, students.first_name, students.last_name, students.patronymic, attendance.visit FROM `schedule` JOIN attendance ON `schedule`.`id`= attendance.schedule_id JOIN subjects ON `schedule`.`subject_id` = subjects.id JOIN students ON attendance.student_id = students.id WHERE `schedule`.`id` = 1', id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(result);
        }
    });
});

router.put('/api/subject_page/:id/', requireAuthAndRole, (req, res)=>{
    const id = req.params.id; 
    
    connection.query('SELECT students.id AS student_id, students.first_name, students.last_name, students.patronymic, attendance.visit FROM `schedule` JOIN attendance ON `schedule`.`id`= attendance.schedule_id JOIN subjects ON `schedule`.`subject_id` = subjects.id JOIN students ON attendance.student_id = students.id WHERE `schedule`.`id` = 1', id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(result);
        }
    });
});


module.exports = router;