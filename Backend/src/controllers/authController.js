


// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const pool = require('../config/db');

// const TOKEN_EXPIRY = '15m';
// const INVITE_EXPIRY_HOURS = 48;

// // POST /api/auth/login  — POS/admin login
// async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ? LIMIT 1', [email]);
//     const user = rows[0];
//     if (!user || user.status !== 'active') {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const match = await bcrypt.compare(password, user.password_hash);
//     if (!match) return res.status(401).json({ error: 'Invalid credentials' });

//     await pool.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role, name: user.full_name },
//       process.env.JWT_SECRET,
//       { expiresIn: TOKEN_EXPIRY }
//     );

//     res.json({ token, user: { id: user.id, name: user.full_name, email: user.email, role: user.role } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Login failed' });
//   }
// }

// // POST /api/auth/invite  — super_admin only
// async function createInvite(req, res) {
//   try {
//     const { email, role } = req.body;
//     if (!email || !role) return res.status(400).json({ error: 'Email and role are required' });

//     const token = crypto.randomBytes(32).toString('hex');
//     const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);

//     await pool.query(
//       'INSERT INTO admin_invites (email, role, token, expires_at) VALUES (?, ?, ?, ?)',
//       [email, role, token, expiresAt]
//     );

//     const inviteLink = `${process.env.POS_URL}/accept-invite?token=${token}`;
//     res.status(201).json({ inviteLink, expiresAt });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not create invite' });
//   }
// }

// // POST /api/auth/accept-invite
// async function acceptInvite(req, res) {
//   try {
//     const { token, fullName, password } = req.body;
//     if (!token || !fullName || !password) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
//     if (password.length < 8) {
//       return res.status(400).json({ error: 'Password must be at least 8 characters' });
//     }

//     const [rows] = await pool.query('SELECT * FROM admin_invites WHERE token = ? AND used = 0 LIMIT 1', [token]);
//     const invite = rows[0];
//     if (!invite) return res.status(400).json({ error: 'Invalid or already-used invite' });
//     if (new Date(invite.expires_at) < new Date()) {
//       return res.status(400).json({ error: 'This invite has expired' });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);
//     await pool.query(
//       'INSERT INTO admin_users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
//       [fullName, invite.email, passwordHash, invite.role]
//     );
//     await pool.query('UPDATE admin_invites SET used = 1 WHERE id = ?', [invite.id]);

//     res.status(201).json({ message: 'Account created — you can now log in.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not complete invite' });
//   }
// }

// // GET /api/admin-users  — super_admin only, powers Settings > Admin accounts
// async function listAdmins(req, res) {
//   try {
//     const [rows] = await pool.query(
//       'SELECT id, full_name, email, role, status, last_login FROM admin_users ORDER BY created_at DESC'
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not load admin accounts' });
//   }
// }

// module.exports = { login, createInvite, acceptInvite, listAdmins };
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');

const TOKEN_EXPIRY = '15m';

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Your account is awaiting admin approval' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Your access has been revoked. Contact a Super Admin.' });
    }

    await pool.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.json({ token, user: { id: user.id, name: user.full_name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
}

// POST /api/auth/register  — public, gated by a shared access code (set in .env)
// Creates a PENDING account — a Super Admin must approve it before it can log in.
async function register(req, res) {
  try {
    const { fullName, email, password, requestedRole, accessCode } = req.body;

    if (!fullName || !email || !password || !requestedRole || !accessCode) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (accessCode !== process.env.ADMIN_SIGNUP_CODE) {
      return res.status(403).json({ error: 'Invalid access code' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    // Nobody can self-register as super_admin — that role is only granted by an
    // existing Super Admin at approval time (or seeded directly in the DB).
    if (requestedRole === 'super_admin') {
      return res.status(400).json({ error: 'Super Admin accounts cannot self-register' });
    }

    const [existing] = await pool.query('SELECT id FROM admin_users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO admin_users (full_name, email, password_hash, role, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [fullName, email, passwordHash, requestedRole]
    );

    res.status(201).json({ message: 'Request submitted. A Super Admin will review your account.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
}

module.exports = { login, register };
