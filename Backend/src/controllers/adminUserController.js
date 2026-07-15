const bcrypt = require('bcrypt');
const pool = require('../config/db');

// GET /api/admin-users?status=pending|active|revoked  — super_admin only
async function listAdmins(req, res) {
  try {
    const { status } = req.query;
    const where = status ? 'WHERE status = ?' : '';
    const params = status ? [status] : [];

    const [rows] = await pool.query(
      `SELECT id, full_name, email, role, status, last_login, created_at
       FROM admin_users ${where} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load admin accounts' });
  }
}

// POST /api/admin-users/:id/approve  — super_admin only, can adjust role at approval time
async function approveAdmin(req, res) {
  try {
    const { role } = req.body || {}; // ← the fix: don't crash when no body is sent
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE id = ?', [req.params.id]);
    const account = rows[0];
    if (!account) return res.status(404).json({ error: 'Account not found' });
    if (account.status !== 'pending') return res.status(400).json({ error: 'This account is not pending' });

    await pool.query(
      "UPDATE admin_users SET status = 'active', role = COALESCE(?, role) WHERE id = ?",
      [role || null, req.params.id]
    );
    res.json({ message: 'Account approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not approve account' });
  }
}

// POST /api/admin-users/:id/deny  — super_admin only
async function denyAdmin(req, res) {
  try {
    await pool.query("UPDATE admin_users SET status = 'revoked' WHERE id = ?", [req.params.id]);
    res.json({ message: 'Request denied' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not deny account' });
  }
}

// DELETE /api/admin-users/:id  — super_admin only, revokes SOMEONE ELSE's access.
// You can never revoke your own account this way (avoids a zero-admin lockout).
async function revokeAdmin(req, res) {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ error: "You can't remove your own account" });
    }
    await pool.query("UPDATE admin_users SET status = 'revoked' WHERE id = ?", [req.params.id]);
    res.json({ message: 'Access revoked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not revoke account' });
  }
}

// PUT /api/admin-users/me  — any logged-in admin, EDIT YOUR OWN PROFILE ONLY.
// There is deliberately no "edit other admin" endpoint — see revokeAdmin for offboarding instead.
async function updateOwnProfile(req, res) {
  try {
    const { fullName, password } = req.body;
    const fields = [];
    const params = [];

    if (fullName) { fields.push('full_name = ?'); params.push(fullName); }
    if (password) {
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
      fields.push('password_hash = ?');
      params.push(await bcrypt.hash(password, 10));
    }
    if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });

    params.push(req.user.id);
    await pool.query(`UPDATE admin_users SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update profile' });
  }
}

module.exports = { listAdmins, approveAdmin, denyAdmin, revokeAdmin, updateOwnProfile };
