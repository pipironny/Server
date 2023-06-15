const express = require('express');

const router = express.Router();

const requireAuth = require('../middleware/user_auth-middleware');

connection = require('../db/mysql-connection').connection;

// Страница посещений студента по id студента и id дисциплины
router.get('/api/student_page/:student_id/:subject_id', requireAuth,(req, res)=>{
    const student_id = req.params.student_id; // id студента
    const subject_id = req.params.subject_id;// id дисциплины
    
    const body = {
        
        title: {
            
        },
        attendance: {
            
        },
        subjects: {

        }
    };

     //  ФИО студента, дисциплина
     connection.query('SELECT CONCAT(students.last_name, " ", students.first_name, " ", students.patronymic) AS full_name, subjects.name AS subject_name FROM students JOIN attendance ON students.id = attendance.student_id JOIN `schedule` ON attendance.schedule_id = `schedule`.id JOIN subjects ON `schedule`.subject_id = subjects.id WHERE students.id = ? AND subjects.id = ? GROUP BY students.id', [student_id, subject_id],
     (err, result) =>{
         if (err){
             console.error("Ошибка подключения " + err.message);
             res.status(500).json({ message: 'Ошибка сервера' });
             return;
         }
         else{
             body.title = result;
         }
     });

    // общая посещаемость
    connection.query('SELECT (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) / COUNT(*) * 100) AS attendance_percentage FROM `attendance` JOIN `schedule` ON attendance.schedule_id = `schedule`.id WHERE attendance.student_id = ? AND `schedule`.`subject_id` = ?', [student_id, subject_id],
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Ошибка сервера' });
            return;
        }
        else{
            body.attendance = result;
        }
    });

    // последние пары (Дата, дисцплина, пара, аудитория, visit).
    connection.query('SELECT `schedule`.`id`, `schedule`.date, subjects.name AS subject_name, `schedule`.`number` AS number, classrooms.number AS classroom, attendance.visit FROM `attendance` JOIN `schedule` ON attendance.schedule_id = `schedule`.id JOIN subjects ON `schedule`.`subject_id` = subjects.id JOIN classrooms ON `schedule`.`classroom_id` = classrooms.id WHERE attendance.student_id = ? AND `schedule`.`subject_id` =? ORDER BY `schedule`.`date` DESC, `schedule`.`number` DESC', [student_id, subject_id],
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Ошибка сервера' });
            return;
        }
        else{
            body.subjects = result;
            if (
                body.title &&
                body.attendance &&
                body.subjects
             ) {
                res.json(body);
             }
        }
    });


});


module.exports = router;