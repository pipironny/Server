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

  try {
    const decodedToken = jwt.verify(authToken, process.env.SECRET_KEY);
    const { Role } = decodedToken;

    if (Role !== 2) {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
module.exports = requireAuthAndRole;