const express = require('express');

const router = express.Router();

connection = require('../db/mysqlConnection').connection;

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