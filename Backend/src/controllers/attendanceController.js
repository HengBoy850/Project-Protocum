


// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');
// const pool = require('../config/db');

// const LATE_THRESHOLD = '09:00:00';

// async function scan(req, res) {
//   try {
//     const { qrToken, deviceLabel } = req.body;
//     if (!qrToken) return res.status(400).json({ error: 'Missing QR token' });

//     const [staffRows] = await pool.query(
//       'SELECT id, full_name, photo_url, status FROM staff WHERE qr_token = ?',
//       [qrToken]
//     );
//     const staff = staffRows[0];
//     if (!staff) return res.status(404).json({ error: 'QR code not recognized' });
//     if (staff.status !== 'active') {
//       return res.status(403).json({ error: 'This account is not active' });
//     }

//     const [lastScanRows] = await pool.query(
//       `SELECT type, scanned_at FROM attendance
//        WHERE staff_id = ? AND DATE(scanned_at) = CURDATE()
//        ORDER BY scanned_at DESC LIMIT 1`,
//       [staff.id]
//     );
//     const lastScan = lastScanRows[0];

//     if (lastScan && (Date.now() - new Date(lastScan.scanned_at).getTime()) < 10000) {
//       return res.status(200).json({
//         duplicate: true,
//         message: 'Already recorded — scan detected twice',
//         staff: { name: staff.full_name, photoUrl: staff.photo_url },
//       });
//     }

//     const nextType = !lastScan || lastScan.type === 'check_out' ? 'check_in' : 'check_out';

//     await pool.query(
//       'INSERT INTO attendance (staff_id, type, device_label) VALUES (?, ?, ?)',
//       [staff.id, nextType, deviceLabel || null]
//     );

//     res.json({
//       type: nextType,
//       staff: { name: staff.full_name, photoUrl: staff.photo_url },
//       scannedAt: new Date(),
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Scan failed' });
//   }
// }

// // GET /api/attendance?range=today|week|month&department=&search=
// // Returns EVERY individual scan event (not collapsed to first-in/last-out),
// // so multiple check-in/check-out pairs in one day all show up.
// // If `search` is provided, the date range is ignored entirely — search spans
// // full history, since that's what "find this person's records" usually means.
// async function listAttendance(req, res) {
//   try {
//     const { range = 'today', department, search } = req.query;
//     const conditions = [];
//     const params = [];

//     if (!search) {
//       let dateCondition = 'DATE(a.scanned_at) = CURDATE()';
//       if (range === 'week') dateCondition = 'YEARWEEK(a.scanned_at, 1) = YEARWEEK(CURDATE(), 1)';
//       if (range === 'month') dateCondition = 'MONTH(a.scanned_at) = MONTH(CURDATE()) AND YEAR(a.scanned_at) = YEAR(CURDATE())';
//       if (range !== 'all') conditions.push(dateCondition);
//     }

//     if (department) { conditions.push('s.department_id = ?'); params.push(department); }
//     if (search) { conditions.push('(s.full_name LIKE ? OR d.name LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

//     const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

//     // DATE_FORMAT gives a plain 'YYYY-MM-DD' string with no timezone conversion —
//     // safe to compare directly on the frontend without a Date round-trip.
//     const [rows] = await pool.query(
//       `SELECT a.id, a.type, a.scanned_at,
//               DATE_FORMAT(a.scanned_at, '%Y-%m-%d') AS day,
//               s.id AS staff_id, s.full_name, d.name AS department_name
//        FROM attendance a
//        JOIN staff s ON s.id = a.staff_id
//        LEFT JOIN departments d ON d.id = s.department_id
//        ${where}
//        ORDER BY a.scanned_at DESC`,
//       params
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not load attendance records' });
//   }
// }

// async function getStats(req, res) {
//   try {
//     const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM staff WHERE status = 'active'");
//     const [[{ pending }]] = await pool.query("SELECT COUNT(*) AS pending FROM staff WHERE status = 'pending'");
//     const [[{ departments }]] = await pool.query('SELECT COUNT(*) AS departments FROM departments');

//     const [[{ checkedIn }]] = await pool.query(`
//       SELECT COUNT(*) AS checkedIn FROM (
//         SELECT staff_id FROM attendance
//         WHERE DATE(scanned_at) = CURDATE()
//         GROUP BY staff_id
//         HAVING SUM(type = 'check_in') > SUM(type = 'check_out')
//       ) t
//     `);

//     res.json({ total, checkedIn, pending, departments });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not load stats' });
//   }
// }

// async function getDashboard(req, res) {
//   try {
//     const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM staff WHERE status = 'active'");

//     const [todayRows] = await pool.query(
//       `SELECT staff_id, MIN(scanned_at) AS first_in
//        FROM attendance
//        WHERE type = 'check_in' AND DATE(scanned_at) = CURDATE()
//        GROUP BY staff_id`
//     );
//     const lateCount = todayRows.filter(
//       (r) => new Date(r.first_in).toTimeString().slice(0, 8) > LATE_THRESHOLD
//     ).length;
//     const presentCount = todayRows.length - lateCount;
//     const absentCount = Math.max(total - todayRows.length, 0);

//     const [trendRows] = await pool.query(
//       `SELECT DATE_FORMAT(scanned_at, '%Y-%m-%d') AS day, COUNT(DISTINCT staff_id) AS count
//        FROM attendance
//        WHERE type = 'check_in' AND scanned_at >= CURDATE() - INTERVAL 6 DAY
//        GROUP BY DATE_FORMAT(scanned_at, '%Y-%m-%d')
//        ORDER BY day ASC`
//     );

//     res.json({
//       total,
//       presentToday: presentCount,
//       lateToday: lateCount,
//       absentToday: absentCount,
//       weeklyTrend: trendRows.map((r) => {
//         const [y, m, d] = r.day.split('-').map(Number);
//         return { day: new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' }), count: r.count };
//       }),
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not load dashboard data' });
//   }
// }

// // GET /api/attendance/me?range=week|month  — staff app History screen, own events only
// async function getMyAttendance(req, res) {
//   try {
//     const { range = 'week' } = req.query;

//     let dateCondition = 'YEARWEEK(scanned_at, 1) = YEARWEEK(CURDATE(), 1)';
//     if (range === 'month') {
//       dateCondition = 'MONTH(scanned_at) = MONTH(CURDATE()) AND YEAR(scanned_at) = YEAR(CURDATE())';
//     }

//     const [rows] = await pool.query(
//       `SELECT DATE_FORMAT(scanned_at, '%Y-%m-%d') AS day,
//               MIN(CASE WHEN type = 'check_in' THEN scanned_at END) AS check_in,
//               MAX(CASE WHEN type = 'check_out' THEN scanned_at END) AS check_out
//        FROM attendance
//        WHERE staff_id = ? AND ${dateCondition}
//        GROUP BY DATE_FORMAT(scanned_at, '%Y-%m-%d')
//        ORDER BY day DESC`,
//       [req.user.id]
//     );

//     const withStatus = rows.map((r) => {
//       let status = 'present';
//       if (r.check_in && new Date(r.check_in).toTimeString().slice(0, 8) > LATE_THRESHOLD) {
//         status = 'late';
//       }
//       return { ...r, status };
//     });

//     res.json(withStatus);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not load your attendance history' });
//   }
// }

// async function fetchReportRows(period) {
//   const dateCondition = period === 'year'
//     ? 'YEAR(a.scanned_at) = YEAR(CURDATE())'
//     : 'MONTH(a.scanned_at) = MONTH(CURDATE()) AND YEAR(a.scanned_at) = YEAR(CURDATE())';

//   const [rows] = await pool.query(
//     `SELECT s.full_name, d.name AS department_name,
//             DATE_FORMAT(a.scanned_at, '%Y-%m-%d') AS day,
//             MIN(CASE WHEN a.type = 'check_in' THEN a.scanned_at END) AS check_in,
//             MAX(CASE WHEN a.type = 'check_out' THEN a.scanned_at END) AS check_out
//      FROM attendance a
//      JOIN staff s ON s.id = a.staff_id
//      LEFT JOIN departments d ON d.id = s.department_id
//      WHERE ${dateCondition}
//      GROUP BY s.id, s.full_name, d.name, DATE_FORMAT(a.scanned_at, '%Y-%m-%d')
//      ORDER BY day DESC, s.full_name ASC`
//   );
//   return rows;
// }

// // GET /api/attendance/export?period=month|year&format=excel|pdf
// async function exportReport(req, res) {
//   try {
//     const { period = 'month', format = 'excel' } = req.query;
//     const rows = await fetchReportRows(period);
//     const label = period === 'year' ? 'Yearly' : 'Monthly';
//     const filenameBase = `${label}-Attendance-Report-${new Date().toISOString().slice(0, 10)}`;

//     if (format === 'pdf') {
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.pdf"`);

//       const doc = new PDFDocument({ margin: 40, size: 'A4' });
//       doc.pipe(res);

//       doc.fontSize(16).text(`${label} Attendance Report`, { align: 'left' });
//       doc.fontSize(10).fillColor('#666').text(new Date().toLocaleDateString(), { align: 'left' });
//       doc.moveDown();

//       const colX = [40, 180, 300, 380, 460];
//       const headerY = doc.y;
//       doc.fontSize(9).fillColor('#000');
//       ['Name', 'Department', 'Date', 'Check In', 'Check Out'].forEach((h, i) => doc.text(h, colX[i], headerY, { width: 120 }));
//       doc.moveDown(0.5);
//       doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor('#ccc').stroke();
//       doc.moveDown(0.3);

//       rows.forEach((r) => {
//         if (doc.y > 760) doc.addPage();
//         const y = doc.y;
//         doc.fontSize(8).fillColor('#000');
//         doc.text(r.full_name, colX[0], y, { width: 130 });
//         doc.text(r.department_name || '—', colX[1], y, { width: 110 });
//         doc.text(r.day, colX[2], y, { width: 70 });
//         doc.text(r.check_in ? new Date(r.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—', colX[3], y, { width: 70 });
//         doc.text(r.check_out ? new Date(r.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—', colX[4], y, { width: 70 });
//         doc.moveDown(0.6);
//       });

//       doc.end();
//       return;
//     }

//     // Excel
//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet(`${label} Report`);
//     sheet.columns = [
//       { header: 'Name', key: 'full_name', width: 24 },
//       { header: 'Department', key: 'department_name', width: 20 },
//       { header: 'Date', key: 'day', width: 14 },
//       { header: 'Check In', key: 'check_in', width: 12 },
//       { header: 'Check Out', key: 'check_out', width: 12 },
//     ];
//     sheet.getRow(1).font = { bold: true };

//     rows.forEach((r) => {
//       sheet.addRow({
//         full_name: r.full_name,
//         department_name: r.department_name || '—',
//         day: r.day,
//         check_in: r.check_in ? new Date(r.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
//         check_out: r.check_out ? new Date(r.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
//       });
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`);
//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not generate report' });
//   }
// }

// module.exports = { scan, listAttendance, getStats, getDashboard, getMyAttendance, exportReport };


const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const pool = require('../config/db');

const LATE_THRESHOLD = '09:00:00';

async function scan(req, res) {
  try {
    const { qrToken, deviceLabel } = req.body;
    if (!qrToken) return res.status(400).json({ error: 'Missing QR token' });

    const [staffRows] = await pool.query(
      'SELECT id, full_name, photo_url, status FROM staff WHERE qr_token = ?',
      [qrToken]
    );
    const staff = staffRows[0];
    if (!staff) return res.status(404).json({ error: 'QR code not recognized' });
    if (staff.status !== 'active') {
      return res.status(403).json({ error: 'This account is not active' });
    }

    const [lastScanRows] = await pool.query(
      `SELECT type, scanned_at FROM attendance
       WHERE staff_id = ? AND DATE(scanned_at) = CURDATE()
       ORDER BY scanned_at DESC LIMIT 1`,
      [staff.id]
    );
    const lastScan = lastScanRows[0];

    if (lastScan && (Date.now() - new Date(lastScan.scanned_at).getTime()) < 10000) {
      return res.status(200).json({
        duplicate: true,
        message: 'Already recorded — scan detected twice',
        staff: { name: staff.full_name, photoUrl: staff.photo_url },
      });
    }

    const nextType = !lastScan || lastScan.type === 'check_out' ? 'check_in' : 'check_out';

    await pool.query(
      'INSERT INTO attendance (staff_id, type, device_label) VALUES (?, ?, ?)',
      [staff.id, nextType, deviceLabel || null]
    );

    res.json({
      type: nextType,
      staff: { name: staff.full_name, photoUrl: staff.photo_url },
      scannedAt: new Date(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scan failed' });
  }
}

async function listAttendance(req, res) {
  try {
    const { range = 'today', department, search } = req.query;
    const conditions = [];
    const params = [];

    if (!search) {
      let dateCondition = 'DATE(a.scanned_at) = CURDATE()';
      if (range === 'week') dateCondition = 'YEARWEEK(a.scanned_at, 1) = YEARWEEK(CURDATE(), 1)';
      if (range === 'month') dateCondition = 'MONTH(a.scanned_at) = MONTH(CURDATE()) AND YEAR(a.scanned_at) = YEAR(CURDATE())';
      if (range !== 'all') conditions.push(dateCondition);
    }

    if (department) { conditions.push('s.department_id = ?'); params.push(department); }
    if (search) { conditions.push('(s.full_name LIKE ? OR d.name LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `SELECT a.id, a.type, a.scanned_at,
              DATE_FORMAT(a.scanned_at, '%Y-%m-%d') AS day,
              s.id AS staff_id, s.full_name, d.name AS department_name
       FROM attendance a
       JOIN staff s ON s.id = a.staff_id
       LEFT JOIN departments d ON d.id = s.department_id
       ${where}
       ORDER BY a.scanned_at DESC`,
      params
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load attendance records' });
  }
}

async function getStats(req, res) {
  try {
    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM staff WHERE status = 'active'");
    const [[{ pending }]] = await pool.query("SELECT COUNT(*) AS pending FROM staff WHERE status = 'pending'");
    const [[{ departments }]] = await pool.query('SELECT COUNT(*) AS departments FROM departments');

    const [[{ checkedIn }]] = await pool.query(`
      SELECT COUNT(*) AS checkedIn FROM (
        SELECT staff_id FROM attendance
        WHERE DATE(scanned_at) = CURDATE()
        GROUP BY staff_id
        HAVING SUM(type = 'check_in') > SUM(type = 'check_out')
      ) t
    `);

    res.json({ total, checkedIn, pending, departments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load stats' });
  }
}

async function getDashboard(req, res) {
  try {
    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM staff WHERE status = 'active'");

    const [todayRows] = await pool.query(
      `SELECT staff_id, MIN(scanned_at) AS first_in
       FROM attendance
       WHERE type = 'check_in' AND DATE(scanned_at) = CURDATE()
       GROUP BY staff_id`
    );
    const lateCount = todayRows.filter(
      (r) => new Date(r.first_in).toTimeString().slice(0, 8) > LATE_THRESHOLD
    ).length;
    const presentCount = todayRows.length - lateCount;
    const absentCount = Math.max(total - todayRows.length, 0);

    const [trendRows] = await pool.query(
      `SELECT DATE_FORMAT(scanned_at, '%Y-%m-%d') AS day, COUNT(DISTINCT staff_id) AS count
       FROM attendance
       WHERE type = 'check_in' AND scanned_at >= CURDATE() - INTERVAL 6 DAY
       GROUP BY DATE_FORMAT(scanned_at, '%Y-%m-%d')
       ORDER BY day ASC`
    );

    res.json({
      total,
      presentToday: presentCount,
      lateToday: lateCount,
      absentToday: absentCount,
      weeklyTrend: trendRows.map((r) => {
        const [y, m, d] = r.day.split('-').map(Number);
        return { day: new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' }), count: r.count };
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load dashboard data' });
  }
}

async function getMyAttendance(req, res) {
  try {
    const { range = 'week' } = req.query;

    let dateCondition = 'YEARWEEK(scanned_at, 1) = YEARWEEK(CURDATE(), 1)';
    if (range === 'month') {
      dateCondition = 'MONTH(scanned_at) = MONTH(CURDATE()) AND YEAR(scanned_at) = YEAR(CURDATE())';
    }

    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(scanned_at, '%Y-%m-%d') AS day,
              MIN(CASE WHEN type = 'check_in' THEN scanned_at END) AS check_in,
              MAX(CASE WHEN type = 'check_out' THEN scanned_at END) AS check_out
       FROM attendance
       WHERE staff_id = ? AND ${dateCondition}
       GROUP BY DATE_FORMAT(scanned_at, '%Y-%m-%d')
       ORDER BY day DESC`,
      [req.user.id]
    );

    const withStatus = rows.map((r) => {
      let status = 'present';
      if (r.check_in && new Date(r.check_in).toTimeString().slice(0, 8) > LATE_THRESHOLD) {
        status = 'late';
      }
      return { ...r, status };
    });

    res.json(withStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load your attendance history' });
  }
}

// GET /api/attendance/me/today — staff app Home screen: every raw event for
// TODAY only, un-collapsed, so multiple check-in/out pairs all show up.
// Naturally "clears and catches a new day" because CURDATE() is evaluated
// fresh on every request — no stored "today" state to reset anywhere.
async function getMyTodayEvents(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, type, scanned_at FROM attendance
       WHERE staff_id = ? AND DATE(scanned_at) = CURDATE()
       ORDER BY scanned_at ASC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load today's activity" });
  }
}

async function fetchReportRows(period) {
  let dateCondition = 'DATE(a.scanned_at) = CURDATE()';
  if (period === 'month') dateCondition = 'MONTH(a.scanned_at) = MONTH(CURDATE()) AND YEAR(a.scanned_at) = YEAR(CURDATE())';
  if (period === 'year') dateCondition = 'YEAR(a.scanned_at) = YEAR(CURDATE())';

  const [rows] = await pool.query(
    `SELECT s.full_name, d.name AS department_name,
            DATE_FORMAT(a.scanned_at, '%Y-%m-%d') AS day,
            MIN(CASE WHEN a.type = 'check_in' THEN a.scanned_at END) AS check_in,
            MAX(CASE WHEN a.type = 'check_out' THEN a.scanned_at END) AS check_out
     FROM attendance a
     JOIN staff s ON s.id = a.staff_id
     LEFT JOIN departments d ON d.id = s.department_id
     WHERE ${dateCondition}
     GROUP BY s.id, s.full_name, d.name, DATE_FORMAT(a.scanned_at, '%Y-%m-%d')
     ORDER BY day DESC, s.full_name ASC`
  );
  return rows;
}

const PERIOD_LABELS = { day: 'Daily', month: 'Monthly', year: 'Yearly' };

async function exportReport(req, res) {
  try {
    const { period = 'month', format = 'excel' } = req.query;
    const rows = await fetchReportRows(period);
    const label = PERIOD_LABELS[period] || 'Monthly';
    const filenameBase = `${label}-Attendance-Report-${new Date().toISOString().slice(0, 10)}`;

    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.pdf"`);

      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      doc.pipe(res);

      doc.fontSize(16).text(`${label} Attendance Report`, { align: 'left' });
      doc.fontSize(10).fillColor('#666').text(new Date().toLocaleDateString(), { align: 'left' });
      doc.moveDown();

      const colX = [40, 180, 300, 380, 460];
      const headerY = doc.y;
      doc.fontSize(9).fillColor('#000');
      ['Name', 'Department', 'Date', 'Check In', 'Check Out'].forEach((h, i) => doc.text(h, colX[i], headerY, { width: 120 }));
      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor('#ccc').stroke();
      doc.moveDown(0.3);

      rows.forEach((r) => {
        if (doc.y > 760) doc.addPage();
        const y = doc.y;
        doc.fontSize(8).fillColor('#000');
        doc.text(r.full_name, colX[0], y, { width: 130 });
        doc.text(r.department_name || '—', colX[1], y, { width: 110 });
        doc.text(r.day, colX[2], y, { width: 70 });
        doc.text(r.check_in ? new Date(r.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—', colX[3], y, { width: 70 });
        doc.text(r.check_out ? new Date(r.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—', colX[4], y, { width: 70 });
        doc.moveDown(0.6);
      });

      doc.end();
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`${label} Report`);
    sheet.columns = [
      { header: 'Name', key: 'full_name', width: 24 },
      { header: 'Department', key: 'department_name', width: 20 },
      { header: 'Date', key: 'day', width: 14 },
      { header: 'Check In', key: 'check_in', width: 12 },
      { header: 'Check Out', key: 'check_out', width: 12 },
    ];
    sheet.getRow(1).font = { bold: true };

    rows.forEach((r) => {
      sheet.addRow({
        full_name: r.full_name,
        department_name: r.department_name || '—',
        day: r.day,
        check_in: r.check_in ? new Date(r.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
        check_out: r.check_out ? new Date(r.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filenameBase}.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not generate report' });
  }
}

module.exports = { scan, listAttendance, getStats, getDashboard, getMyAttendance, getMyTodayEvents, exportReport };
