const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const requireAuthAndRole = require('../middleware/admin_auth-middleware');

connection = require('../db/mysql-connection').connection;

// все группы по id преподавателя (id группы, название, количество дисциплин)
router.get('/api/all_groups_admin/', requireAuthAndRole,(req, res)=>{
    
    connection.query('SELECT groups.id, groups.name AS group_name, COUNT(DISTINCT `schedule`.subject_id) AS subject_count FROM `groups` JOIN `schedule` ON groups.id = `schedule`.`group_id` GROUP BY groups.id, groups.name;',
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