const express = require('express');

const router = express.Router();

// Промежуточное ПО (Middleware)
const requireAuth = require('../middleware/user_auth-middleware');
const requireAuthAndRole = require('../middleware/admin_auth-middleware');

connection = require('../db/mysql-connection').connection;

// 4 Страница отметки посещаемость конкретной пары, по id занятия:
router.get('/api/visit_page/:id', (req, res)=>{
    const id = req.params.id; 
    
    connection.query('SELECT students.id AS student_id, students.first_name, students.last_name, students.patronymic, attendance.visit FROM `schedule` JOIN attendance ON `schedule`.`id`= attendance.schedule_id JOIN subjects ON `schedule`.`subject_id` = subjects.id JOIN students ON attendance.student_id = students.id WHERE `schedule`.`id` = ?', id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Ошибка сервера' });
            return;
        }
        else{
            res.send(result);
        }
    });
});

router.put('/api/visit_page/PUT', (req, res)=>{
    const scheduleId = req.body.scheduleId; // Идентификатор занятия
    const attendance = req.body.attendance; // Массив посещаемости студентов
    
    attendance.forEach((student) =>{
        const studentId = student.studentId;
        const visit = student.visit;


        connection.query('INSERT INTO `attendance` (schedule_id, student_id, visit) VALUES (?, ?, ?)', 
        [scheduleId, studentId, visit],
        (err, result) =>{
            if (err){
                console.error("Ошибка добавления " + err.message);
                res.status(500).json({ error: 'Ошибка при добавлении' });
                return;
            }
            else{
                res.status(200).json({ message: 'Посещение успешно обновлено' });
            }
        });


    });

});

module.exports = router;