const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// API-1
// Регистрация нового пользователя в таблице employees
router.post('/api/register', (req, res) => {
  const id = req.body.id;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const patronymic = req.body.patronymic;
  const Department_id = req.body.Department_id;
  const Role_id = req.body.Role_id;
  const { username, password } = req.body;
  
    // Хеширование пароля
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Ошибка hash" + err.message);
        res.status(500).send('Internal Server Error');
        return;
      }
      // Добавление пользователя в базу данных
      connection.query('INSERT INTO `employees` VALUES (?,?,?,?,?,?,?,?)',
        [id, first_name, last_name, patronymic, Department_id, Role_id, username, hash],
        (err, results) => {
          if (err) {
            console.error("Ошибка подключения " + err.message);
            res.status(500).send('Internal Server Error');
            return;
          }
          // Возвращение статуса успешного выполнения
          res.status(200).send('Регистрация успешно завершена');
        }
      );
    });
  });

// обработчик POST-запроса на эндпоинт /login
router.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM employees WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        if (results.length === 0) {
          res.sendStatus(401);
        } else {
          const user = results[0];
          // Проверка пароля
          const result = bcrypt.compareSync(password, user.hashpassword);
          if (result == true) {
            const token = jwt.sign({ userId: user.id, Role: user.Role_id }, process.env.SECRET_KEY, {
              expiresIn: '1h'
            });

            // сохраняем токен в таблице sessions
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);
            connection.query('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
              [token, user.id, expiresAt],
              (err, results) => {
                if (err) {
                  console.log(err);
                  res.sendStatus(500);
                } else {
                  res.send({ token });
                }
              }
            );
          } else {
            res.sendStatus(401);
          }
        }
      }
    }
  );
});

// Этот запрос API принимает GET-запрос и возвращает сессии
  router.get("/api/sessions", (req, res)=>{
    connection.query('SELECT * FROM `sessions`', (err, result, fields) =>{
        if (err){
            return console.error("Ошибка подключения " + err.message);
        }
        else{
           res.send(result);
           //console.log(result);
        }
    });
});

module.exports = router;