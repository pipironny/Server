const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const requireAuth = require('../middleware/user_auth-middleware');

connection = require('../db/mysql-connection').connection;

// Страница студента, по id студента:
router.get('/api/student_page/:id', requireAuth, (req, res)=>{
    const id = req.params.id; // id студента
    const authHeader = req.headers.authorization;
    const [authType, authToken] = authHeader.split(' ');
    const decodedToken = jwt.verify(authToken, process.env.SECRET_KEY);
    const teacher_id  = decodedToken.userId; // id преподавателя
    const role  = decodedToken.Role; // роль

    const body = {
        
        title: {
            
        },
        attendance: {
            
        },
        subjects: {

        }
    };

    //  ФИО студента, название группы
    connection.query('SELECT CONCAT(students.last_name, " ", students.first_name, " ", students.patronymic) AS full_name, groups.name AS group_name FROM students JOIN groups ON students.group_id = groups.id WHERE students.id = ?', id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        else{
            body.title = result;
        }
    });


    // посещаемость по всем дисциплинам
    connection.query('SELECT (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) / COUNT(*) * 100) AS attendance_percentage FROM `attendance` JOIN `schedule` ON attendance.schedule_id = schedule.id JOIN subjects ON `schedule`.subject_id = subjects.id WHERE attendance.student_id = ?', id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        else{
            body.attendance = result;
        }
    });


    if (role == 2){
        // все дисциплины, к которым привязана группа студента 
        connection.query('SELECT subjects.id AS subject_id, subjects.name AS subject_name, (COUNT(CASE WHEN attendance.visit IN (1, 2) THEN 1 END) / COUNT(attendance.id)) * 100 AS attendance_percentage FROM `attendance` JOIN `schedule` ON attendance.schedule_id = `schedule`.id JOIN subjects ON `schedule`.subject_id = subjects.id WHERE attendance.student_id = ? GROUP BY subjects.id, subjects.name;', id,
        (err, result) =>{
            if (err){
                console.error("Ошибка подключения " + err.message);
                res.status(500).json({ message: 'Internal Server Error' });
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
    } else {
         // все дисциплины, к которым привязана группа студента но только для этого преподавателя
         connection.query('SELECT DISTINCT subjects.id AS subject_id, subjects.name AS subject_name FROM subjects JOIN `schedule` ON subjects.id = `schedule`.subject_id JOIN groups ON `schedule`.group_id = groups.id JOIN students ON groups.id = students.group_id WHERE students.id = ? AND `schedule`.employee_id = ?', [id, teacher_id],
         (err, result) =>{
             if (err){
                 console.error("Ошибка подключения " + err.message);
                 res.status(500).json({ message: 'Internal Server Error' });
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
    }


});

module.exports = router;