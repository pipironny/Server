const express = require('express');

const router = express.Router();

// Промежуточное ПО (Middleware)
const requireAuth = require('../middleware/user_auth-middleware');

connection = require('../db/mysql-connection').connection;

// 4 Страница отметки посещаемость конкретной пары, по id занятия:
router.get('/api/visit_page/:id', requireAuth, (req, res)=>{
    const id = req.params.id; // id занятия (schedule)
    
    // id, ФИО и посещаемость(visit) всех студентов группы по этой дисциплине в отдельности
    connection.query('SELECT students.id AS student_id, CONCAT(students.last_name, " ", students.first_name, " ", students.patronymic) AS full_name, attendance.visit FROM `schedule` JOIN attendance ON `schedule`.`id`= attendance.schedule_id JOIN subjects ON `schedule`.`subject_id` = subjects.id JOIN students ON attendance.student_id = students.id WHERE `schedule`.`id` = ?', id,
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

// запрос, в котором приходят отметки посещений (1 - посещение, 2 - уважит., 3 - пропуск). Уважительные = посещение 
router.put('/api/visit_page/:schedule_id', requireAuth, (req, res)=>{
    const schedule_id = req.params.schedule_id; // id занятия (schedule)
    const attendanceData = req.body.attendance; // Массив посещаемости студентов
    
    // массив значений
    const attendance = attendanceData.map(data => [schedule_id, data.student_id, data.visit]);

    connection.query('INSERT INTO `attendance` (schedule_id, student_id, visit) VALUES ?' + 'ON DUPLICATE KEY UPDATE visit = VALUES(visit)', 
        [attendance],
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

module.exports = router;