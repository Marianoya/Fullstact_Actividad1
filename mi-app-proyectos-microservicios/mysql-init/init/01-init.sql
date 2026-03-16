CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS users_db;
CREATE DATABASE IF NOT EXISTS projects_db;
CREATE DATABASE IF NOT EXISTS tasks_db;

CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'app123';
ALTER USER 'appuser'@'%' IDENTIFIED BY 'app123';

GRANT ALL PRIVILEGES ON auth_db.* TO 'appuser'@'%';
GRANT ALL PRIVILEGES ON users_db.* TO 'appuser'@'%';
GRANT ALL PRIVILEGES ON projects_db.* TO 'appuser'@'%';
GRANT ALL PRIVILEGES ON tasks_db.* TO 'appuser'@'%';

USE auth_db;
CREATE TABLE IF NOT EXISTS auth_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auth_email ON auth_users(email);

USE users_db;
CREATE TABLE IF NOT EXISTS gestion_usuarios (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  nombre_programador VARCHAR(100) NOT NULL,
  correo_electronico VARCHAR(100) NOT NULL UNIQUE,
  especialidad VARCHAR(100)
);

CREATE INDEX idx_users_correo ON gestion_usuarios(correo_electronico);

USE projects_db;
CREATE TABLE IF NOT EXISTS creacion_proyectos (
  id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
  nombre_proyecto VARCHAR(100) NOT NULL,
  descripcion_proyecto TEXT,
  status_proyecto VARCHAR(50) DEFAULT 'activo'
);

CREATE INDEX idx_projects_status ON creacion_proyectos(status_proyecto);

USE tasks_db;
CREATE TABLE IF NOT EXISTS asignacion_tareas (
  id_tarea INT AUTO_INCREMENT PRIMARY KEY,
  nombre_tarea VARCHAR(100) NOT NULL,
  contenido_tarea TEXT,
  desarrollador_id INT,
  proyecto_id INT,
  status_tarea VARCHAR(50) DEFAULT 'activo'
);

CREATE INDEX idx_tasks_dev ON asignacion_tareas(desarrollador_id);
CREATE INDEX idx_tasks_project ON asignacion_tareas(proyecto_id);
CREATE INDEX idx_tasks_status ON asignacion_tareas(status_tarea);

FLUSH PRIVILEGES;

