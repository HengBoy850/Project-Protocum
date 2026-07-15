const pool = require('../config/db');

// GET /api/departments  — public-ish (used by both POS and staff registration form)
async function listDepartments(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT d.id, d.name, COUNT(s.id) AS staff_count
      FROM departments d
      LEFT JOIN staff s ON s.department_id = d.id AND s.status = 'active'
      GROUP BY d.id, d.name
      ORDER BY d.name ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load departments' });
  }
}

// POST /api/departments  — admin only
async function createDepartment(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Department name is required' });
    }
    const [result] = await pool.query('INSERT INTO departments (name) VALUES (?)', [name.trim()]);
    res.status(201).json({ id: result.insertId, name: name.trim() });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'That department already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not create department' });
  }
}

// PUT /api/departments/:id  — admin only
async function updateDepartment(req, res) {
  try {
    const { name } = req.body;
    await pool.query('UPDATE departments SET name = ? WHERE id = ?', [name.trim(), req.params.id]);
    res.json({ message: 'Department updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update department' });
  }
}

// DELETE /api/departments/:id  — admin only
async function deleteDepartment(req, res) {
  try {
    await pool.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Department deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete department' });
  }
}

module.exports = { listDepartments, createDepartment, updateDepartment, deleteDepartment };
