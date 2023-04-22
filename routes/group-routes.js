const express = require('express');

const router = express.Router();

connection = require('../db/mysqlConnection').connection;

router.get("/api/group", (req, res)=>{
    connection.query('SELECT * FROM `group`', (err, result, fields) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

router.post('/api/group', (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;

    connection.query('INSERT INTO `group` VALUES(?,?)',[id, name], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("Успешно добавлено");
        }
    });
});

router.delete('/api/group/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `group` WHERE id=?',delId ,(err, result) =>{
        if (err){
            return console.error("Ошибка подключения" + err.message);
        }
        else{
            res.send("DELETED");
            //console.log(result);
        }
    });
});

module.exports = router;