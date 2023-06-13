const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// 4 Страница отметки посещаемость конкретной пары, по id занятия:
router.get('/api/visit_page/:id/', requireAuthAndRole, (req, res)=>{
    const id = req.params.id; 
    
    connection.query('SELECT students.id AS student_id, students.first_name, students.last_name, students.patronymic, attendance.visit FROM `schedule` JOIN attendance ON `schedule`.`id`= attendance.schedule_id JOIN subjects ON `schedule`.`subject_id` = subjects.id JOIN students ON attendance.student_id = students.id WHERE `schedule`.`id` = 1', id,
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

router.put('/api/visit_page/:id/', requireAuthAndRole, (req, res)=>{
    const attendanceData = req.body;
    // Создаем массив значений для каждой отметки
    const attendanceArray = attendanceData.map((item) => [item.student_id, item.visit]); 
    
    connection.query('INSERT INTO `attendance` (student_id, visit) VALUES ?', [attendanceArray],
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