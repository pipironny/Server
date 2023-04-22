require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const PORT = process.env.PORT ?? 3000;
const app = express();

// Routes
const groupRoutes = require('./routes/group-routes');
const studentRoutes = require('./routes/student-routes');
const attendanceRoutes = require('./routes/attendance-routes');
const authRoutes = require('./routes/auth-routes');
const departmentRoutes = require('./routes/department-routes');
const employeesRoutes = require('./routes/employees-routes');
const roleRoutes = require('./routes/role-routes');
const scheduleRoutes = require('./routes/schedule-routes');
const subjectRoutes = require('./routes/subject-routes');

// Middleware, parse the incoming requests with JSON payloads
app.use(express.json());

// Global Error Handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    console.error(err.name);
    console.error(err.code);
    res.status(500).send('Что-то пошло не так');
});

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

app.use(authRoutes);
app.use(attendanceRoutes);
app.use(departmentRoutes);
app.use(employeesRoutes);
app.use(groupRoutes);
app.use(roleRoutes);
app.use(scheduleRoutes);
app.use(studentRoutes);
app.use(subjectRoutes);

app.listen(PORT, () => {
    console.log(`Server running on localhost port ${PORT}...`);
});
