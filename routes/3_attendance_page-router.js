const express = require('express');

const router = express.Router();

// Промежуточное ПО (Middleware)
const requireAuth = require('../middleware/user_auth-middleware');

connection = require('../db/mysql-connection').connection;


// 3 Страница посещаемости группы по определенной дисциплине, по id группы и дисциплины:
router.get('/api/attendance_page/:group_id/:subject_id', requireAuth,(req, res)=>{
    const group_id = req.params.group_id; // id группы
    const subject_id = req.params.subject_id;// id дисциплины

    const body = {
        
        title: {
            
        },
        subjects: {
            
        },
        students: {

        }
    };

    // название дисциплины и группы
    connection.query('SELECT subjects.name AS subject_name, groups.name AS group_name FROM subjects JOIN groups ON subjects.id = ? AND groups.id = ?',[subject_id, group_id],
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            body.title = result;
        }
    });

    // Последние пары,
    connection.query('SELECT `schedule`.id AS schedule_id, `schedule`.date, subjects.name AS subject_name, classrooms.number AS classroom, `schedule`.group_id FROM `schedule` JOIN subjects ON `schedule`.subject_id = subjects.id JOIN classrooms ON `schedule`.`classroom_id` = classrooms.id WHERE `schedule`.group_id = ? AND `schedule`.subject_id = ? ORDER BY `schedule`.date DESC, `schedule`.number DESC',[group_id , subject_id],
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            body.subjects = result;
        }
    });

    // студенты( ФИО, посещаемость(%) этой дисциплины)
    connection.query('SELECT students.id AS student_id, CONCAT(students.last_name, " ", students.first_name, " ", students.patronymic) AS full_name, (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS attendance_percentage FROM students JOIN attendance ON students.id = attendance.student_id JOIN `schedule` ON attendance.schedule_id = `schedule`.id WHERE `schedule`.group_id = ? AND `schedule`.subject_id = ? GROUP BY students.id, students.first_name, students.last_name, students.patronymic',[group_id , subject_id],
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        else{
            body.students = result;
            if (
                body.title &&
                body.subjects &&
                body.students
             ) {
                res.json(body);
             }
        }
    });

});

module.exports = router;
