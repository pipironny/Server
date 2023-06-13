const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// Страница студента, по id студента:
router.get('/api/student_page/:id/', requireAuthAndRole, (req, res)=>{
    const id = req.params.id; 
    
    const body = {
        attendance: {
            
        },
        subjects: {

        }
    };

    // посещаемость по всем дисциплинам
    connection.query('SELECT (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) / COUNT(*) * 100) AS attendance_percentage FROM `attendance` JOIN `schedule` ON attendance.schedule_id = schedule.id JOIN subjects ON `schedule`.subject_id = subjects.id WHERE attendance.student_id = ?', id,
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

    // все дисциплины, к которым привязана группа студента
    connection.query('SELECT subjects.id AS subject_id, subjects.name AS subjects_name FROM `attendance` JOIN `schedule` ON attendance.schedule_id = schedule.id JOIN subjects ON `schedule`.subject_id = subjects.id WHERE attendance.student_id = ?', id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Ошибка сервера' });
            return;
        }
        else{
            body.subjects = result;
        }
    });


});

module.exports = router;