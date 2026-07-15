// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const path = require('path');

// const authRoutes = require('./src/routes/authRoute');
// const departmentRoutes = require('./src/routes/departmentRoute');
// const staffRoutes = require('./src/routes/staffRoute');
// const attendanceRoutes = require('./src/routes/attendanceRoute');
// const adminUserRoutes = require('./src/routes/adminUser');

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/api/auth', authRoutes);
// app.use('/api/departments', departmentRoutes);
// app.use('/api/staff', staffRoutes);
// app.use('/api/attendance', attendanceRoutes);

// app.get('/', (req, res) => res.json({ status: 'ok', service: 'attendance-backend' }));

// // Central error handler (catches multer file errors etc.)
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(400).json({ error: err.message || 'Something went wrong' });
// });
// app.use('/api/admin-users', adminUserRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./src/routes/authRoute');
const departmentRoutes = require('./src/routes/departmentRoute');
const staffRoutes = require('./src/routes/staffRoute');
const attendanceRoutes = require('./src/routes/attendanceRoute');
const adminUserRoutes = require('./src/routes/adminUser');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin-users', adminUserRoutes);   // ← moved up here, with the other routes

app.get('/', (req, res) => res.json({ status: 'ok', service: 'attendance-backend' }));

// Central error handler — MUST stay last, after every route
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));