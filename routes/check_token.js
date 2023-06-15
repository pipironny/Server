const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

connection = require('../db/mysql-connection').connection;

// запрос на проверку токена
router.post('/api/check_token', (req, res) => {
    const authToken = req.body.authToken;
  
    if (authToken) {
      jwt.verify(authToken, process.env.SECRET_KEY, (err, decodedToken) => {
        if (err) {
          // Неверный токен или истек срок действия
          res.status(401).json({ valid: false });
        } else {
          // Токен проверен успешно
          // console.log (decodedToken);
          const { Role, name } = decodedToken;
          res.status(200).json({ valid: true, role: Role, name });
        }
      });
    } else {
      // Токен отсутствует
      res.status(401).json({ valid: false });
    }
  });

module.exports = router;