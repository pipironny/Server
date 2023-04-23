const express = require('express');

const router = express.Router();

connection = require('../db/mysqlConnection').connection;

router.get("/api/schedule", (req, res)=>{
    connection.query('SELECT * FROM `schedule`', (err, result, fields) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

router.post('/api/schedule', (req, res)=>{
    const id = req.body.id;
    const Group_id = req.body.Group_id;
    const Employees_id = req.body.Employees_id;
    const Subject_id = req.body.Subject_id;
    const date = req.body.date;

    connection.query('INSERT INTO `schedule` VALUES(?,?,?,?,?)',[id, Group_id, Employees_id, Subject_id, date], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("Успешно добавлено");
        }
    });
});

router.put('/api/schedule/:id', (req, res)=>{
    const Upid = req.params.id;
    const Group_id = req.body.Group_id;
    const Employees_id = req.body.Employees_id;// Err Cannot add or update a child row: a foreign key constraint fails (`serverbd`.`schedule`, CONSTRAINT `Subject_Employees` FOREIGN KEY (`Employees_id`) REFERENCES `employees` (`id`))
    const Subject_id = req.body.Subject_id;
    //const date = req.body.date;

    connection.query('UPDATE `schedule` SET `Group_id` = ?, `Employees_id` = ?, `Subject_id` = ? WHERE id =?',[Group_id, Employees_id, Subject_id, Upid], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send(`Запись с id ${Upid} обновлена`);
        }
    });
});

router.delete('/api/schedule/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `schedule` WHERE id=?',delId ,(err, result) =>{
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