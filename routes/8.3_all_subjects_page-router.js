const express = require('express');

const router = express.Router();

const requireAuth = require('../middleware/user_auth-middleware');

connection = require('../db/mysql-connection').connection;

// все дисциплины преподавателя по id( id дисциплины, название, количество групп)
router.get('/api/all_subjects/:id', requireAuth,(req, res)=>{
    const id = req.params.id; // id преподавателя
    
    connection.query('SELECT subjects.id, subjects.name AS subject_name, COUNT(DISTINCT schedule.group_id) AS group_count FROM `subjects` JOIN `schedule` ON subjects.id = `schedule`.`subject_id` WHERE `schedule`.`employee_id` = ? GROUP BY subjects.id, subjects.name', id,
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