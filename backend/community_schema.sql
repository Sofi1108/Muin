-- Script de creación de tablas para la funcionalidad de Comunidad
-- Asegurar que nombre_usuario de la tabla USUARIO tiene una restricción UNIQUE para poder referenciarla
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_nombre_usuario'
    ) THEN
        ALTER TABLE USUARIO ADD CONSTRAINT unique_nombre_usuario UNIQUE (nombre_usuario);
    END IF;
END;
$$;

-- Crear tabla PUBLICACION
CREATE TABLE IF NOT EXISTS PUBLICACION (
    id_publicacion SERIAL PRIMARY KEY,
    imagen VARCHAR(255),
    nombre_usuario VARCHAR(50) NOT NULL REFERENCES USUARIO(nombre_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    descripcion TEXT NOT NULL,
    fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuarios_megusta VARCHAR(50)[] DEFAULT '{}'
);

-- Crear tabla COMENTARIO
CREATE TABLE IF NOT EXISTS COMENTARIO (
    id_comentario SERIAL PRIMARY KEY,
    id_publicacion INT NOT NULL REFERENCES PUBLICACION(id_publicacion) ON DELETE CASCADE,
    nombre_usuario VARCHAR(50) NOT NULL REFERENCES USUARIO(nombre_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    comentario VARCHAR(150) NOT NULL,
    fecha_comentario TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
