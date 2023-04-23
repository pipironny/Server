const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

connection = require('../db/mysqlConnection').connection;

// Регистрация нового пользователя в таблице employees
router.post('/api/register', (req, res) => {
    const { username, password } = req.body;
  
    // Хеширование пароля
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      // Добавление пользователя в базу данных
      connection.query(
        'INSERT INTO employees (username, password) VALUES (?, ?)',
        [username, hash],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
  
          // Создание токена доступа JWT
          const token = jwt.sign({ username }, 'secret-key');
  
          // Возвращение токена и статуса успешного выполнения
          res.status(200).json({ token });
        }
      );
    });
  });

// обработчик POST-запроса на эндпоинт /login
router.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    connection.query(
      'SELECT * FROM employees WHERE username = ?',
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
  
            if (password === user.password) {
              const token = jwt.sign({ username }, 'secret-key', {
                expiresIn: '1h'
              });
  
              // сохраняем токен в таблице sessions
              const expiresAt = new Date();
              expiresAt.setHours(expiresAt.getHours() + 1);
              connection.query(
                'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
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