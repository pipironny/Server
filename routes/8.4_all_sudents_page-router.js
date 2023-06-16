const express = require('express');

const router = express.Router();

// Промежуточное ПО (Middleware)
const requireAuthAndRole = require('../middleware/admin_auth-middleware');

connection = require('../db/mysql-connection').connection;

// Все студенты (id студента, ФИО, группа, номер зачетки, общая посещаемость) admin only
router.get('/api/all_students/', requireAuthAndRole, (req, res)=>{
    connection.query('SELECT students.id AS student_id, CONCAT(students.last_name, " ", students.first_name, " ", students.patronymic) AS full_name, groups.name AS group_name, students.studID_number AS studID_number, (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS attendance_percentage FROM students JOIN attendance ON students.id = attendance.student_id JOIN `schedule` ON attendance.schedule_id = `schedule`.id JOIN groups ON students.group_id = groups.id GROUP BY students.id, students.last_name, students.first_name, students.group_id, students.studID_number',
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        else{
            res.send(result);
        }
    });
});

module.exports = router;