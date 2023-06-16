require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT ?? 3000;
const app = express();

// Middleware (Промежуточное ПО) для настройки стандарта CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', `*`); // Здесь указывается домен веб-страницы
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');// Допустимые запросы
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');// Допустимые заголовки
  next();
});

// Путь маршрутов
const authRoutes = require('./routes/auth-router');
const groupRoutes = require('./routes/2_group_page-router');
const attendanceRoutes = require('./routes/3_attendance_page-router');
const visitRoutes = require('./routes/4_visit_page-router');
const studentRoutes = require('./routes/5_student_page-router');
const student_attendanceRoutes = require('./routes/6_student_attendance_page-router');
const subjectRoutes = require('./routes/7_subject_page-router');
const scheduleRoutes = require('./routes/8.1_schedule_page-router');
const all_groupsRoutes = require('./routes/8.2_all_groups_page-router');
const all_groups_adminRoutes = require('./routes/8.2_all_groups_admin');
const all_subjectsRoutes = require('./routes/8.3_all_subjects_page-router');
const all_subjects_adminRoutes = require('./routes/8.3_all_subjects_admin');
const all_studentsRoutes = require('./routes/8.4_all_sudents_page-router');
const searchRoutes = require('./routes/9_search-router');
const tokenRoutes = require('./routes/check_token');

// Middleware (Промежуточное ПО), анализирует входящие запросы с полезными данными JSON.
app.use(express.json());

// Глобальный обработчик ошибок
app.use(function(err, req, res, next) {
    console.error(err.stack);
    console.error(err.name);
    console.error(err.code);
    res.status(500).send('Что-то пошло не так');
});
 
// Маршруты
app.use(authRoutes);
app.use(groupRoutes);
app.use(attendanceRoutes);
app.use(visitRoutes);
app.use(studentRoutes);
app.use(student_attendanceRoutes);
app.use(subjectRoutes);
app.use(scheduleRoutes);
app.use(all_groupsRoutes);
app.use(all_groups_adminRoutes);
app.use(all_subjectsRoutes);
app.use(all_subjects_adminRoutes);
app.use(all_studentsRoutes);
app.use(searchRoutes);
app.use(tokenRoutes);


const interval = 1000 * 60 * 60; // 1 час
// установка интервала для удаления сессий
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
 
// Запуск сервера на порту PORT
app.listen(PORT, () => {
    console.log(`Server running on localhost port ${PORT}...`);
});
