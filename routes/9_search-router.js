const express = require('express');

const router = express.Router();

// Промежуточное ПО (Middleware)
const requireAuth = require('../middleware/user_auth-middleware');
const requireAuthAndRole = require('../middleware/admin_auth-middleware');

connection = require('../db/mysql-connection').connection;

// Поиск по дисциплинам и группам.
router.get('/api/search/:term', requireAuth,(req, res)=>{
    const search_term = req.params.term;

    connection.query(`SELECT subjects.id AS subject_id, subjects.name AS subject_name, NULL AS group_id, NULL AS group_name FROM subjects WHERE subjects.name LIKE '${search_term}%' UNION SELECT NULL AS subject_id, NULL AS subject_name, groups.id AS group_id, groups.name AS group_name FROM groups WHERE groups.name LIKE '${search_term}%' LIMIT 5`,
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

// Поиск по дисциплинам
router.get('/api/subject_search/:term', requireAuth,(req, res)=>{
    const search_term = req.params.term;

    connection.query(`SELECT subjects.id, subjects.name AS subject_name FROM subjects WHERE name LIKE '${search_term}%' LIMIT 5`,
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

// Поиск по группам.
router.get('/api/group_search/:term', requireAuth,(req, res)=>{
    const search_term = req.params.term;

    connection.query(`SELECT groups.id, groups.name AS group_name FROM groups WHERE name LIKE '${search_term}%' LIMIT 5`,
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