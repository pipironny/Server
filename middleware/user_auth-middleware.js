const express = require('express');
const jwt = require('jsonwebtoken');

// Промежуточное ПО для проверки аутентификации пользователя User
requireAuth = function requireAuth(req, res, next) {
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
      req.user = decodedToken;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
  
 module.exports = requireAuth;