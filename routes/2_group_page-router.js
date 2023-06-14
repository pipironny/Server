const express = require('express');

const router = express.Router();

// Промежуточное ПО (Middleware)
const requireAuth = require('../middleware/user_auth-middleware');

connection = require('../db/mysql-connection').connection;

// 2 Страница группы, по id группы:
router.get('/api/group_page/:id', requireAuth, (req, res)=>{
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
     connection.query('SELECT students.id, students.first_name, students.last_name, students.patronymic, (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) / COUNT(DISTINCT schedule.id) * 100) AS attendance_percentage FROM `students` JOIN attendance ON students.id = attendance.student_id JOIN `schedule` ON attendance.schedule_id = `schedule`.id JOIN subjects ON `schedule`.subject_id = subjects.id WHERE students.group_id=? GROUP BY students.id, students.first_name, students.last_name;',id ,
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
     connection.query('SELECT  `schedule`.`subject_id` AS subject_id, subjects.name AS subjects_name, (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) / COUNT(*) * 100) AS attendance_percentage FROM `schedule` JOIN attendance ON `schedule`.id = attendance.schedule_id JOIN subjects ON `schedule`.subject_id = subjects.id WHERE `schedule`.group_id = ? GROUP BY schedule.subject_id, subjects.name;',id ,
     (err, result) =>{
         if (err){
             console.error("Ошибка подключения " + err.message);
             res.status(500).send('Internal Server Error');
             return;
         }
         else{
             body.subjects = result;
             if (
                body.schedule &&
                body.attendance &&
                body.students &&
                body.subjects
             ) {
                res.json(body);
             }
         }
     });


     

});

module.exports = router;