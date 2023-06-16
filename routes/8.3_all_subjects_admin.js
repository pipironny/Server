const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const requireAuthAndRole = require('../middleware/admin_auth-middleware');

connection = require('../db/mysql-connection').connection;

// все дисциплины ( id дисциплины, название, количество групп)
router.get('/api/all_subjects_admin/', requireAuth,(req, res)=>{

    connection.query('',
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