const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

// Промежуточное ПО (Middleware)
const requireAuth = require('../middleware/user_auth-middleware');
const requireAuthAndRole = require('../middleware/admin_auth-middleware');

connection = require('../db/mysql-connection').connection;

// Поиск по дисциплинам и группам.
router.get('/api/search/:term', requireAuth,(req, res)=>{
    const search_term = req.params.term;// ввод слова
    const authHeader = req.headers.authorization;
    const [authType, authToken] = authHeader.split(' ');
    const decodedToken = jwt.verify(authToken, process.env.SECRET_KEY);
    const teacher_id  = decodedToken.userId; // id преподавателя
    const role  = decodedToken.Role; // id преподавателя


    if (role == 2){
        //поиск по всем дисциплинам и группам
        connection.query(`SELECT subjects.id AS subject_id, subjects.name AS subject_name, NULL AS group_id, NULL AS group_name FROM subjects WHERE subjects.name LIKE '${search_term}%' UNION SELECT NULL AS subject_id, NULL AS subject_name, groups.id AS group_id, groups.name AS group_name FROM groups WHERE groups.name LIKE '${search_term}%' LIMIT 5`,
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
    } else {
        //поиск по дисциплинам и группам преподавателя
        connection.query(`SELECT subjects.id AS subject_id, subjects.name AS subject_name, NULL AS group_id, NULL AS group_name FROM subjects JOIN schedule ON subjects.id = schedule.subject_id JOIN employees ON schedule.employee_id = employees.id WHERE subjects.name LIKE '${search_term}%' AND employees.id = ? UNION SELECT NULL AS subject_id, NULL AS subject_name, groups.id AS group_id, groups.name AS group_name FROM groups JOIN schedule ON groups.id = schedule.group_id JOIN employees ON schedule.employee_id = employees.id WHERE groups.name LIKE '${search_term}%' AND employees.id = ? LIMIT 5`, [teacher_id, teacher_id],
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
    }


});

module.exports = router;