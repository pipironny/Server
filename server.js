require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT ?? 3000;
const app = express();

// Middleware
//const requireAuth = require('./middleware/auth-middleware');

// Routers path
const groupRoutes = require('./routers/group-router');
const studentRoutes = require('./routers/student-router');
const attendanceRoutes = require('./routers/attendance-router');
const authRoutes = require('./routers/auth-router');
const departmentRoutes = require('./routers/department-router');
const employeesRoutes = require('./routers/employees-router');
const roleRoutes = require('./routers/role-router');
const scheduleRoutes = require('./routers/schedule-router');
const subjectRoutes = require('./routers/subject-router');

// Middleware, parse the incoming requests with JSON payloads
app.use(express.json());

// Global Error Handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    console.error(err.name);
    console.error(err.code);
    res.status(500).send('Что-то пошло не так');
});

app.get('/', (req, res) =>{
    res.send("Main page");
});
 
// Маршруты
app.use(authRoutes);
app.use(attendanceRoutes);
app.use(departmentRoutes);
app.use(employeesRoutes);
app.use(groupRoutes);
app.use(roleRoutes);
app.use(scheduleRoutes);
app.use(studentRoutes);
app.use(subjectRoutes);

const interval = 1000 * 60 * 60; // 1 hour

setInterval(deleteExpiredSessions, interval);

// Удаление истёкших сессий
function deleteExpiredSessions() {
    const now = new Date();
    connection.query(
      'DELETE FROM sessions WHERE expires_at < ?',
      [now],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Deleted ${results.affectedRows} expired sessions`);
        }
      }
    );
  }
 
app.listen(PORT, () => {
    console.log(`Server running on localhost port ${PORT}...`);
});
