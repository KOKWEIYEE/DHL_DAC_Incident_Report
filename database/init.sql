CREATE DATABASE IF NOT EXISTS dhldac_incident_report
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dhldac_incident_report;

CREATE TABLE IF NOT EXISTS roles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_role_name (role_name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  CONSTRAINT fk_users_role_id
    FOREIGN KEY (role_id) REFERENCES roles (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO roles (role_name)
VALUES ('admin')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

SET @admin_role_id := (
  SELECT id
  FROM roles
  WHERE role_name = 'admin'
  LIMIT 1
);

INSERT INTO users (username, password_hash, full_name, role_id)
VALUES ('admin', SHA2('Admin@12345', 256), 'System Administrator', @admin_role_id)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role_id = VALUES(role_id);