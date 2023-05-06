const express = require('express');
const jwt = require('jsonwebtoken');

connection = require('../db/mysql-connection').connection;

// Промежуточное ПО для проверки аутентификации и роли пользователя
requireAuthAndRole = function requireAuthAndRole(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const [authType, authToken] = authHeader.split(' ');

  if (authType !== 'Bearer' || !authToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Парсинг и декодирование токена
  const tokenParts = authToken.split('.');
  if (tokenParts.length !== 3) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

/* после получения и разделения токена на три части, мы извлекаем полезную нагрузку (payload) из второй части токена. 
Затем мы декодируем payload из формата base64 и преобразуем его в объект JavaScript с помощью JSON.parse.
Далее, мы проверяем наличие декодированного токена и userId, чтобы убедиться, что токен корректный и содержит необходимую информацию. */
  const payloadBase64 = tokenParts[1];
  const payload = Buffer.from(payloadBase64, 'base64').toString('utf-8');
  const decodedToken = JSON.parse(payload);

  if (!decodedToken || !decodedToken.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = decodedToken;

  console.log (decodedToken);

  // Проверка роли пользователя в токене
  if (decodedToken.Role !== 2) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
}

module.exports = requireAuthAndRole;
