import mysql.connector
from mysql.connector import Error, errorcode

DB_NAME = "mi_app_desarrollo_proyectos"

TABLES = {}

TABLES["creacion_proyectos"] = """
CREATE TABLE IF NOT EXISTS creacion_proyectos (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_proyecto VARCHAR(150) NOT NULL UNIQUE,
    descripcion_proyecto VARCHAR(255),
    status_proyecto VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
"""


TABLES["gestion_usuarios"] = """
CREATE TABLE IF NOT EXISTS gestion_usuarios (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nombre_programador VARCHAR(150) NOT NULL UNIQUE,
    correo_electronico VARCHAR(150) NOT NULL UNIQUE,
    especialidad VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
"""

TABLES["asignacion_tareas"] = """
CREATE TABLE IF NOT EXISTS asignacion_tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tarea VARCHAR(150) NOT NULL UNIQUE,
    contenido_tarea TEXT NOT NULL,
    desarrollador_id INT NOT NULL,
    proyecto_id INT NOT NULL,
    status_tarea VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tareas_proyecto
        FOREIGN KEY (proyecto_id) REFERENCES creacion_proyectos(id_proyecto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_tareas_desarrollador
        FOREIGN KEY (desarrollador_id) REFERENCES gestion_usuarios(id_user)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB
"""


def crear_base_y_tablas():
    conexion = None
    cursor = None

    try:
        # Conexión al servidor MySQL SIN elegir base todavía
        conexion = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            port=int(DB_PORT)
        )

        cursor = conexion.cursor()

        # Crear base de datos
        cursor.execute(
            f"CREATE DATABASE IF NOT EXISTS {DB_NAME} "
            "DEFAULT CHARACTER SET utf8mb4 "
            "DEFAULT COLLATE utf8mb4_unicode_ci"
        )
        print(f"Base de datos '{DB_NAME}' creada o ya existente.")

        # Seleccionar la base
        cursor.execute(f"USE {DB_NAME}")

        # Crear tablas
        for nombre_tabla, ddl in TABLES.items():
            cursor.execute(ddl)
            print(f"Tabla '{nombre_tabla}' creada o ya existente.")

        # Insertar categorías iniciales
        cursor.execute("""
            INSERT IGNORE INTO creacion_proyectos (id_proyecto, nombre_proyecto, descripcion_proyecto, status_proyecto)
            VALUES
                (1, 'cummins pagina web', 'Creacion de pagina web', 'activo'),
                (2, 'Honeywell pagina web', 'Creacion de pagina web', 'activo'),
                (3, 'Prosegur app', 'Actualizacion de app', 'activo')
        """)

        conexion.commit()
        print("Filas iniciales insertadas.")
        print("Proceso terminado correctamente.")

    except Error as e:
        print("Error al crear la base o las tablas:", e)

    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None and conexion.is_connected():
            conexion.close()
            print("Conexión cerrada.")

if __name__ == "__main__":
    crear_base_y_tablas()