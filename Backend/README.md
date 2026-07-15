-- Staff Attendance Management System — schema
-- Run this once against your MySQL server (matches your .env DB_NAME)

CREATE DATABASE IF NOT EXISTS `staff-management`;
USE `staff-management`;

-- ─── Departments ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Staff (self-registered employees) ──────────────────────
CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(20) UNIQUE,          -- e.g. EMP-0142, assigned on approval
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30),
  department_id INT,
  position VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  photo_url VARCHAR(500),                    -- proof photo taken/uploaded at registration
  status ENUM('pending','active','inactive','denied') DEFAULT 'pending',
  qr_token VARCHAR(255) UNIQUE,               -- generated only on approval
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL,
  approved_by INT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- ─── Admin / POS users ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin','manager','hr') DEFAULT 'manager',
  status ENUM('active','revoked') DEFAULT 'active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Admin invites (invite-only POS provisioning) ───────────
CREATE TABLE IF NOT EXISTS admin_invites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL,
  role ENUM('super_admin','manager','hr') DEFAULT 'manager',
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Attendance scans ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  type ENUM('check_in','check_out') NOT NULL,
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  device_label VARCHAR(100),                  -- e.g. "Front Door Kiosk"
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
);

-- ─── Seed a first Super Admin so you can log in immediately ──
-- Password below is bcrypt hash of: Admin@12345  (CHANGE THIS after first login)
INSERT INTO admin_users (full_name, email, password_hash, role)
VALUES ('Admin Kessler', 'admin@company.com', '$2b$10$2tBk5nnkJBmTiThLfyHnCOVRIahiZI1u6GJMvfFhNYPtwh8ghPaeG', 'super_admin')
ON DUPLICATE KEY UPDATE email = email;

-- ─── Sample departments to get started ───────────────────────
INSERT IGNORE INTO departments (name) VALUES
  ('Sales'), ('Finance'), ('Operations'), ('HR'), ('IT'), ('Marketing');

  -- Run this against your existing database — adds 'pending' as a valid status
-- so self-registered POS accounts can wait for approval, same as staff.

ALTER TABLE admin_users
  MODIFY COLUMN status ENUM('pending','active','revoked') DEFAULT 'pending';

-- Your existing seeded admin (admin@company.com) stays 'active' since it was
-- inserted directly, not through registration — no data loss from this change.





npm install exceljs pdfkit