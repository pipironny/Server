const express = require('express');

const router = express.Router();

connection = require('../db/mysqlConnection').connection;

router.get("/api/role", (req, res)=>{
    connection.query('SELECT * FROM `role`', (err, result, fields) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

router.post('/api/role', (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;

    connection.query('INSERT INTO `role` VALUES(?,?)',[id, name], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("POSTES");
        }
    });
});

router.delete('/api/role/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `role` WHERE id=?',delId ,(err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("DELETED");
            //console.log(result);
        }
    });
});

module.exports = router;