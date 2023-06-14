const express = require('express');

const router = express.Router();

const requireAuth = require('../middleware/user_auth-middleware');

connection = require('../db/mysql-connection').connection;

// Расписание по дате и id преподавателя (id занятия, пара, дисциплина, группа, аудитория)
router.get('/api/schedule_page/:id', requireAuth,(req, res)=>{
    const id = req.params.id; 
    const date = req.body.date;
    
    connection.query('SELECT `schedule`.`id` AS schedule_id, `schedule`.`number` AS number, subjects.name AS subject_name, groups.name AS group_name, classrooms.number AS classroom FROM `schedule` JOIN subjects ON `schedule`.`subject_id` = subjects.id JOIN groups ON `schedule`.`group_id` = groups.id JOIN classrooms ON `schedule`.`classroom_id`= classrooms.id JOIN employees ON `schedule`.`employee_id` = employees.id WHERE employees.id = ? AND `schedule`.`date` = ? GROUP BY `schedule`.`number`', [id, date],
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

module.exports = router;