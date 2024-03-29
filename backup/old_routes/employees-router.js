const express = require('express');

// Промежуточное ПО (Middleware)
const requireAuth = require('../middleware/user_auth-middleware');
const requireAuthAndRole = require('../middleware/admin_auth-middleware');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// Этот запрос API принимает GET-запрос и возвращает сотрудников
router.get("/api/employees", (req, res)=>{
    connection.query('SELECT * FROM `employees`', 
    (err, result, fields) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

// Этот запрос API принимает PUT-запрос и изменяет данные [id] сотрудника в базе данных
router.put('/api/employees/:id', requireAuthAndRole, (req, res)=>{
    const Upid = req.params.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const patronymic = req.body.patronymic;
    const Department_id = req.body.Department_id;
    const username = req.body.username;
    //const hashpassword = req.body.hashpassword;
    const Role_id = req.body.Role_id;

    connection.query('UPDATE `employees` SET `first_name` = ?,`last_name` = ?,`patronymic` = ?,`Department_id` = ?,`username` = ?,`Role_id` = ? WHERE id =?',
    [first_name, last_name, patronymic, Department_id, username, Role_id, Upid], 
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(`Сотрудник с id ${Upid} обновлен`);
        }
    });
});

// Этот запрос API принимает DELETE-запрос и удаляет данные [id] сотрудника из базы данных
router.delete('/api/employees/:id', requireAuthAndRole, (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `employees` WHERE id=?',delId ,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send("Удалено");
            //console.log(result);
        }
    });
});

module.exports = router;