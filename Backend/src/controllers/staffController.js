
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const QRCode = require('qrcode');
// const pool = require('../config/db');

// // POST /api/staff/register  — public, multipart/form-data (includes 'photo' file)
// async function register(req, res) {
//   try {
//     const { fullName, email, phone, departmentId, position, password } = req.body;

//     if (!fullName || !email || !phone || !departmentId || !position || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }
//     if (password.length < 8) {
//       return res.status(400).json({ error: 'Password must be at least 8 characters' });
//     }
//     if (!req.file) {
//       return res.status(400).json({ error: 'A proof photo is required to register' });
//     }

//     const [existing] = await pool.query('SELECT id FROM staff WHERE email = ?', [email]);
//     if (existing.length) {
//       return res.status(409).json({ error: 'An account with this email already exists' });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);
//     const photoUrl = `/uploads/staff/${req.file.filename}`;

//     const [result] = await pool.query(
//       `INSERT INTO staff (full_name, email, phone, department_id, position, password_hash, photo_url, status)
//        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
//       [fullName, email, phone, departmentId, position, passwordHash, photoUrl]
//     );

//     res.status(201).json({
//       message: 'Registration submitted. An admin will review your account.',
//       staffId: result.insertId,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// }

// // GET /api/staff?status=pending|active|inactive|denied&department=&search=  — admin/POS only
// async function listStaff(req, res) {
//   try {
//     const { status, department, search } = req.query;
//     const conditions = [];
//     const params = [];

//     if (status) { conditions.push('s.status = ?'); params.push(status); }
//     if (department) { conditions.push('s.department_id = ?'); params.push(department); }
//     if (search) {
//       conditions.push('(s.full_name LIKE ? OR s.employee_code LIKE ? OR d.name LIKE ?)');
//       params.push(`%${search}%`, `%${search}%`, `%${search}%`);
//     }

//     const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

//     const [rows] = await pool.query(
//       `SELECT s.id, s.employee_code, s.full_name, s.email, s.phone, s.position,
//               s.photo_url, s.status, s.created_at, s.approved_at,
//               d.id AS department_id, d.name AS department_name
//        FROM staff s
//        LEFT JOIN departments d ON d.id = s.department_id
//        ${where}
//        ORDER BY s.created_at DESC`,
//       params
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not load staff' });
//   }
// }

// // POST /api/staff/:id/approve  — admin/POS only
// async function approveStaff(req, res) {
//   try {
//     const { id } = req.params;
//     const [rows] = await pool.query('SELECT * FROM staff WHERE id = ?', [id]);
//     const staff = rows[0];
//     if (!staff) return res.status(404).json({ error: 'Staff not found' });
//     if (staff.status === 'active') return res.status(400).json({ error: 'Already active' });

//     const employeeCode = `EMP-${String(id).padStart(4, '0')}`;
//     const qrToken = crypto.randomBytes(24).toString('hex');

//     await pool.query(
//       `UPDATE staff
//        SET status = 'active', employee_code = ?, qr_token = ?, approved_at = NOW(), approved_by = ?
//        WHERE id = ?`,
//       [employeeCode, qrToken, req.user.id, id]
//     );

//     const qrDataUrl = await QRCode.toDataURL(qrToken);
//     res.json({ message: 'Staff approved', employeeCode, qrDataUrl });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not approve staff' });
//   }
// }

// // POST /api/staff/:id/deny  — admin/POS only
// async function denyStaff(req, res) {
//   try {
//     await pool.query("UPDATE staff SET status = 'denied' WHERE id = ?", [req.params.id]);
//     res.json({ message: 'Registration denied' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not deny staff' });
//   }
// }

// // PUT /api/staff/:id  — admin/POS only
// async function updateStaff(req, res) {
//   try {
//     const { departmentId, position, status } = req.body;
//     const fields = [];
//     const params = [];

//     if (departmentId) { fields.push('department_id = ?'); params.push(departmentId); }
//     if (position) { fields.push('position = ?'); params.push(position); }
//     if (status) { fields.push('status = ?'); params.push(status); }
//     if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });

//     params.push(req.params.id);
//     await pool.query(`UPDATE staff SET ${fields.join(', ')} WHERE id = ?`, params);
//     res.json({ message: 'Staff updated' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not update staff' });
//   }
// }

// // DELETE /api/staff/:id  — admin/POS only, soft delete
// async function deactivateStaff(req, res) {
//   try {
//     await pool.query("UPDATE staff SET status = 'inactive' WHERE id = ?", [req.params.id]);
//     res.json({ message: 'Staff deactivated' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not deactivate staff' });
//   }
// }

// // GET /api/staff/:id/qr  — admin/POS only. Route-level requireRole keeps a staff
// // token from ever reaching this handler, so there's no self/other check needed here.
// async function getStaffQr(req, res) {
//   try {
//     const [rows] = await pool.query('SELECT qr_token FROM staff WHERE id = ?', [req.params.id]);
//     const staff = rows[0];
//     if (!staff || !staff.qr_token) {
//       return res.status(404).json({ error: 'No QR code for this staff member yet' });
//     }
//     const qrDataUrl = await QRCode.toDataURL(staff.qr_token);
//     res.json({ qrDataUrl });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not generate QR' });
//   }
// }

// // POST /api/staff/login  — staff app login
// async function staffLogin(req, res) {
//   try {
//     const { email, password } = req.body;
//     const [rows] = await pool.query('SELECT * FROM staff WHERE email = ?', [email]);
//     const staff = rows[0];
//     if (!staff) return res.status(401).json({ error: 'Invalid credentials' });

//     const match = await bcrypt.compare(password, staff.password_hash);
//     if (!match) return res.status(401).json({ error: 'Invalid credentials' });

//     if (staff.status === 'pending') {
//       return res.status(403).json({ error: 'Your account is still pending admin approval' });
//     }
//     if (staff.status !== 'active') {
//       return res.status(403).json({ error: 'Your account is not active. Contact admin.' });
//     }

//     const token = jwt.sign(
//       { id: staff.id, email: staff.email, role: 'staff' },
//       process.env.JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     res.json({
//       token,
//       staff: {
//         id: staff.id, name: staff.full_name, email: staff.email,
//         employeeCode: staff.employee_code, photoUrl: staff.photo_url,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Login failed' });
//   }
// }

// // GET /api/staff/me  — staff app "who am I", used by Home/Profile screens.
// // Uses req.user.id from the JWT — never an :id param — so it can only ever be your own data.
// async function getMyProfile(req, res) {
//   try {
//     const [rows] = await pool.query(
//       `SELECT s.id, s.employee_code, s.full_name, s.email, s.phone, s.position,
//               s.photo_url, s.status, d.name AS department_name
//        FROM staff s
//        LEFT JOIN departments d ON d.id = s.department_id
//        WHERE s.id = ?`,
//       [req.user.id]
//     );
//     const staff = rows[0];
//     if (!staff) return res.status(404).json({ error: 'Profile not found' });
//     res.json(staff);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not load profile' });
//   }
// }

// // GET /api/staff/me/qr  — staff app, always your own QR only
// async function getMyQr(req, res) {
//   try {
//     const [rows] = await pool.query('SELECT qr_token FROM staff WHERE id = ?', [req.user.id]);
//     const staff = rows[0];
//     if (!staff || !staff.qr_token) {
//       return res.status(404).json({ error: 'Your account has not been approved yet' });
//     }
//     const qrDataUrl = await QRCode.toDataURL(staff.qr_token);
//     res.json({ qrDataUrl });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not generate QR' });
//   }
// }

// module.exports = {
//   register, listStaff, approveStaff, denyStaff,
//   updateStaff, deactivateStaff, getStaffQr, staffLogin,
//   getMyProfile, getMyQr,
// };


const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const pool = require('../config/db');

async function register(req, res) {
  try {
    const { fullName, email, phone, departmentId, position, password } = req.body;

    if (!fullName || !email || !phone || !departmentId || !position || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'A proof photo is required to register' });
    }

    const [existing] = await pool.query('SELECT id FROM staff WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const photoUrl = `/uploads/staff/${req.file.filename}`;

    const [result] = await pool.query(
      `INSERT INTO staff (full_name, email, phone, department_id, position, password_hash, photo_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [fullName, email, phone, departmentId, position, passwordHash, photoUrl]
    );

    res.status(201).json({
      message: 'Registration submitted. An admin will review your account.',
      staffId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function listStaff(req, res) {
  try {
    const { status, department, search } = req.query;
    const conditions = [];
    const params = [];

    if (status) { conditions.push('s.status = ?'); params.push(status); }
    if (department) { conditions.push('s.department_id = ?'); params.push(department); }
    if (search) {
      conditions.push('(s.full_name LIKE ? OR s.employee_code LIKE ? OR d.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `SELECT s.id, s.employee_code, s.full_name, s.email, s.phone, s.position,
              s.photo_url, s.status, s.created_at, s.approved_at,
              d.id AS department_id, d.name AS department_name
       FROM staff s
       LEFT JOIN departments d ON d.id = s.department_id
       ${where}
       ORDER BY s.created_at DESC`,
      params
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load staff' });
  }
}

async function approveStaff(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM staff WHERE id = ?', [id]);
    const staff = rows[0];
    if (!staff) return res.status(404).json({ error: 'Staff not found' });
    if (staff.status === 'active') return res.status(400).json({ error: 'Already active' });

    const employeeCode = `EMP-${String(id).padStart(4, '0')}`;
    const qrToken = crypto.randomBytes(24).toString('hex');

    await pool.query(
      `UPDATE staff
       SET status = 'active', employee_code = ?, qr_token = ?, approved_at = NOW(), approved_by = ?
       WHERE id = ?`,
      [employeeCode, qrToken, req.user.id, id]
    );

    const qrDataUrl = await QRCode.toDataURL(qrToken);
    res.json({ message: 'Staff approved', employeeCode, qrDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not approve staff' });
  }
}

async function denyStaff(req, res) {
  try {
    await pool.query("UPDATE staff SET status = 'denied' WHERE id = ?", [req.params.id]);
    res.json({ message: 'Registration denied' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not deny staff' });
  }
}

async function updateStaff(req, res) {
  try {
    const { departmentId, position, status } = req.body;
    const fields = [];
    const params = [];

    if (departmentId) { fields.push('department_id = ?'); params.push(departmentId); }
    if (position) { fields.push('position = ?'); params.push(position); }
    if (status) { fields.push('status = ?'); params.push(status); }
    if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });

    params.push(req.params.id);
    await pool.query(`UPDATE staff SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Staff updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update staff' });
  }
}

async function deactivateStaff(req, res) {
  try {
    await pool.query("UPDATE staff SET status = 'inactive' WHERE id = ?", [req.params.id]);
    res.json({ message: 'Staff deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not deactivate staff' });
  }
}

async function getStaffQr(req, res) {
  try {
    const [rows] = await pool.query('SELECT qr_token FROM staff WHERE id = ?', [req.params.id]);
    const staff = rows[0];
    if (!staff || !staff.qr_token) {
      return res.status(404).json({ error: 'No QR code for this staff member yet' });
    }
    const qrDataUrl = await QRCode.toDataURL(staff.qr_token);
    res.json({ qrDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not generate QR' });
  }
}

async function staffLogin(req, res) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM staff WHERE email = ?', [email]);
    const staff = rows[0];
    if (!staff) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, staff.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    if (staff.status === 'pending') {
      return res.status(403).json({ error: 'Your account is still pending admin approval' });
    }
    if (staff.status !== 'active') {
      return res.status(403).json({ error: 'Your account is not active. Contact admin.' });
    }

    const token = jwt.sign(
      { id: staff.id, email: staff.email, role: 'staff' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      staff: {
        id: staff.id, name: staff.full_name, email: staff.email,
        employeeCode: staff.employee_code, photoUrl: staff.photo_url,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
}

async function getMyProfile(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.employee_code, s.full_name, s.email, s.phone, s.position,
              s.photo_url, s.status, d.name AS department_name
       FROM staff s
       LEFT JOIN departments d ON d.id = s.department_id
       WHERE s.id = ?`,
      [req.user.id]
    );
    const staff = rows[0];
    if (!staff) return res.status(404).json({ error: 'Profile not found' });
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load profile' });
  }
}

async function getMyQr(req, res) {
  try {
    const [rows] = await pool.query('SELECT qr_token FROM staff WHERE id = ?', [req.user.id]);
    const staff = rows[0];
    if (!staff || !staff.qr_token) {
      return res.status(404).json({ error: 'Your account has not been approved yet' });
    }
    const qrDataUrl = await QRCode.toDataURL(staff.qr_token);
    res.json({ qrDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not generate QR' });
  }
}

// PUT /api/staff/me  — staff app Profile screen: edit own name / phone / password only.
// Deliberately cannot touch email, department, position, or status — those stay
// admin-controlled, same self/other split used on the POS side.
async function updateMyProfile(req, res) {
  try {
    const { fullName, phone, password } = req.body;
    const fields = [];
    const params = [];

    if (fullName) { fields.push('full_name = ?'); params.push(fullName); }
    if (phone) { fields.push('phone = ?'); params.push(phone); }
    if (password) {
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
      fields.push('password_hash = ?');
      params.push(await bcrypt.hash(password, 10));
    }
    if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });

    params.push(req.user.id);
    await pool.query(`UPDATE staff SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update profile' });
  }
}

module.exports = {
  register, listStaff, approveStaff, denyStaff,
  updateStaff, deactivateStaff, getStaffQr, staffLogin,
  getMyProfile, getMyQr, updateMyProfile,
};
