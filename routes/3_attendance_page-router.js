const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;


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

module.exports = router;
