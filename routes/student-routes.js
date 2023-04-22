const express = require('express');
const mysql = require("mysql2");

const router = express.Router();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

connection.connect(function(err){
    if (err){
        return console.error("Ошибка подключения " + err.message);
    }
    else{
        console.log("Соединение с сервером MySQL успешно установлено ");
    }
});



router.get("/api/student", (req, res)=>{
    connection.query('SELECT * FROM `student`', (err, result, fields) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

router.post('/api/student', (req, res)=>{
    const id = req.body.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const patronymic = req.body.patronymic;
    const studID_number = req.body.studID_number;
    const Group_id = req.body.Group_id;

    connection.query('INSERT INTO `student` VALUES(?,?,?,?,?,?)',[id, first_name, last_name, patronymic, studID_number, Group_id], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send("POSTES");
        }
    });
});

router.put('/api/student/:id', (req, res)=>{
    const Upid = req.params.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const patronymic = req.body.patronymic;
    const studID_number = req.body.studID_number;
    //const Group_id = req.body.Group_id;
    //,`Group_id` = ?

    connection.query('UPDATE `student` SET `first_name` = ?,`last_name` = ?,`patronymic` = ?,`studID_number` = ? WHERE id =?',[first_name, last_name, patronymic, studID_number, Upid], (err, result) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
            res.send(`Subject with id ${Upid} has been updated`);
        }
    });
});

router.delete('/api/student/:id', (req, res)=>{
    const delId = req.params.id;

    connection.query('DELETE FROM `student` WHERE id=?',delId ,(err, result) =>{
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