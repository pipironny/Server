const express = require('express');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

//API-2
// данные о шершуле, по id препода  и дате получить все объекты такого типа: id шершули, номер пары, название предмета, название группы, номер кабинета
router.get("/api/schedule-info", (req, res)=>{
    connection.query('SELECT * FROM `schedule`', 
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

//API-3
// данные по группам, по id  препода получить все объекты такого типа: id группы, группа, Количество дисциплин
router.get('/api/employees-groups/:id', requireAuthAndRole, (req, res)=>{
    const id = req.params.id;

    connection.query('SELECT id FROM `groups` WHERE employees_id=?',id ,
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