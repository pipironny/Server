const express = require('express');

const router = express.Router();

const requireAuth = require('../middleware/user_auth-middleware');

connection = require('../db/mysql-connection').connection;

// Страница дисциплины, по id дисциплины:
router.get('/api/subject_page/:id', requireAuth,(req, res)=>{
    const id = req.params.id;// id дисциплины
    
    const body = {
    
        title: {
            
        },
        attendance: {
            
        },
        subjects: {

        },
        groups: {

        },
        employees: {

        },
    };

     //  Название дисциплины
     connection.query('SELECT name AS subject_name FROM subjects WHERE subjects.id=?', id,
     (err, result) =>{
         if (err){
             console.error("Ошибка подключения " + err.message);
             res.status(500).json({ message: 'Ошибка сервера' });
             return;
         }
         else{
             body.title = result;
         }
     });

    // общая посещаемость
    connection.query('SELECT (SUM(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) / COUNT(*) * 100) AS attendance_percentage FROM `attendance` JOIN `schedule` ON attendance.schedule_id = `schedule`.id WHERE `schedule`.`subject_id` = ?', id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Ошибка сервера' });
            return;
        }
        else{
            body.attendance = result;
        }
    });

    // последние пары (Дата, дисцплина, пара, аудитория, visit).
    connection.query('SELECT `schedule`.`id`, `schedule`.`date`, subjects.name AS subject_name, `schedule`.`number`, classrooms.number AS classroom FROM `schedule` JOIN subjects ON `schedule`.`subject_id` = subjects.id JOIN classrooms ON `schedule`.`classroom_id` = classrooms.id WHERE subjects.id = ? ORDER BY `schedule`.`date` DESC, `schedule`.`number` DESC', id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Ошибка сервера' });
            return;
        }
        else{
            body.subjects = result;
        }
    });


    // группы( id, название, средняя посещаемость дисциплины этой группой)
    connection.query('SELECT groups.id, groups.name AS group_name, AVG(CASE WHEN attendance.visit IN (1, 2) THEN 1 ELSE 0 END) * 100 AS attendance_percentage FROM `groups` JOIN students ON groups.id = students.group_id JOIN attendance ON students.id = attendance.student_id JOIN `schedule` ON attendance.schedule_id = `schedule`.`id` JOIN subjects ON `schedule`.`subject_id` = subjects.id WHERE subjects.id = ? GROUP BY groups.id, groups.name', id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Ошибка сервера' });
            return;
        }
        else{
            body.groups = result;
        }
    });

    // преподы(ФИО и кафедра)
    connection.query('SELECT CONCAT(employees.last_name, " ", employees.first_name, " ", employees.patronymic) AS full_name, departments.name AS department FROM employees JOIN departments ON employees.department_id = departments.id JOIN `schedule` ON employees.id = `schedule`.`employee_id` JOIN subjects ON `schedule`.`subject_id` = subjects.id WHERE subjects.id = ? AND employees.department_id IS NOT NULL GROUP BY employees.first_name', id,
    (err, result) =>{
        if (err){
            console.error("Ошибка подключения " + err.message);
            res.status(500).json({ message: 'Ошибка сервера' });
            return;
        }
        else{
            body.employees = result;
            if (
                body.title &&
                body.attendance &&
                body.subjects &&
                body.groups &&
                body.employees
             ) {
                res.json(body);
             }
        }
    });

});



module.exports = router;