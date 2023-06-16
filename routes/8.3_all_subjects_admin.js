const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const requireAuthAndRole = require('../middleware/admin_auth-middleware');

connection = require('../db/mysql-connection').connection;

// все дисциплины ( id дисциплины, название, количество групп)
router.get('/api/all_subjects_admin/', requireAuthAndRole,(req, res)=>{

    connection.query('SELECT subjects.id, subjects.name AS subject_name, COUNT(DISTINCT schedule.group_id) AS group_count FROM `subjects` JOIN `schedule` ON subjects.id = `schedule`.`subject_id` GROUP BY subjects.id, subjects.name',
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