const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

router.get("/api/subject", (req, res)=>{
    connection.query('SELECT * FROM `subject`', (err, result, fields) =>{
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

router.post('/api/subject', (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    connection.query('INSERT INTO `subject` VALUES(?,?,?)',[id, name, description], (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send("Успешно добавлено");
        }
    });
});

router.put('/api/subject/:id', (req, res)=>{
    const Upid = req.params.id;
    const name = req.body.name;
    const description = req.body.description;

    connection.query('UPDATE `subject` SET `name` = ?, `description` = ? WHERE id =?',[name, description, Upid], (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            res.send(`Предмет с id ${Upid} обновлен`);
        }
    });
});

router.delete('/api/subject/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `subject` WHERE id=?',delId ,(err, result) =>{
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