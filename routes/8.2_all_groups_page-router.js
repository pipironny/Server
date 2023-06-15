const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const requireAuth = require('../middleware/user_auth-middleware');

connection = require('../db/mysql-connection').connection;

// все группы по id преподавателя (id группы, название, количество дисциплин)
router.get('/api/all_groups/', requireAuth,(req, res)=>{
    const authHeader = req.headers.authorization;
    const [authType, authToken] = authHeader.split(' ');
    const decodedToken = jwt.verify(authToken, process.env.SECRET_KEY);
    const id  = decodedToken.userId; // id преподавателя
    
    connection.query('SELECT groups.id, groups.name AS group_name, COUNT(DISTINCT schedule.subject_id) AS subject_count FROM `groups` JOIN `schedule` ON groups.id = `schedule`.`group_id` WHERE `schedule`.`employee_id` = ? GROUP BY groups.id, groups.name', id,
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