const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

router.get("/api/employees", (req, res)=>{
    connection.query('SELECT * FROM `employees`', (err, result, fields) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

router.post('/api/employees', (req, res)=>{
    const id = req.body.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const patronymic = req.body.patronymic;
    const Department_id = req.body.Department_id;
    const login = req.body.login;
    const hashpassword = req.body.hashpassword;
    const Role_id = req.body.Role_id;

    connection.query('INSERT INTO `employees` VALUES(?,?,?,?,?,?,?,?)',[id, first_name, last_name, patronymic, Department_id, login,hashpassword, Role_id], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("Успешно добавлено");
        }
    });
});

router.put('/api/employees/:id', (req, res)=>{
    const Upid = req.params.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const patronymic = req.body.patronymic;
    const Department_id = req.body.Department_id;
    const username = req.body.username;
    //const hashpassword = req.body.hashpassword;
    const Role_id = req.body.Role_id;

    connection.query('UPDATE `employees` SET `first_name` = ?,`last_name` = ?,`patronymic` = ?,`Department_id` = ?,`username` = ?,`Role_id` = ? WHERE id =?',[first_name, last_name, patronymic, Department_id, username, Role_id, Upid], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send(`Сотрудник с id ${Upid} обновлен`);
        }
    });
});

router.delete('/api/employees/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `employees` WHERE id=?',delId ,(err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("Удалено");
            //console.log(result);
        }
    });
});

module.exports = router;