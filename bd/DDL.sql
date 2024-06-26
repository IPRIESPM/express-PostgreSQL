CREATE TABLE TFG_versiones (
    tabla varchar(60) PRIMARY KEY,
    version_n integer DEFAULT 0
);

CREATE OR REPLACE FUNCTION actualizar_version()
  RETURNS TRIGGER AS $$
BEGIN
  EXECUTE FORMAT('UPDATE TFG_versiones SET version_n = version_n + 1 WHERE tabla = %L', TG_TABLE_NAME);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create table TFG_profesores(
    dni varchar(12) primary key,
    nombre varchar(100),
    telefono integer,
    correo varchar(100),
    contrasena VARCHAR(255),
    tipo varchar(10) check (tipo in ('admin','user')) default 'user',
    modificado timestamp DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO TFG_versiones (tabla)
VALUES ('tfg_profesores');

create table TFG_empresa(
    cif varchar(12) primary key,
    nombre varchar(60),
    localidad varchar(50),
    comunidad varchar(50),
    direccion varchar(100),
    telefono integer,
    modificado timestamp DEFAULT CURRENT_TIMESTAMP,
    profesor_encargado varchar(12) references TFG_profesores
);

INSERT INTO TFG_versiones (tabla)
VALUES ('tfg_empresa');

CREATE TRIGGER trigger_actualizar_version_empresa
AFTER INSERT OR UPDATE OR DELETE ON TFG_empresa
FOR EACH ROW
EXECUTE PROCEDURE actualizar_version();


create table TFG_contactos(
    n integer primary key GENERATED ALWAYS AS IDENTITY,
    nombre varchar(100),
    correo varchar(100),
    telefono integer,
    dni varchar(10),
    tipo varchar(20) check (tipo in ('Gerente','Jefe Proyecto','Técnico','Tutor','RRHH')),
    principal boolean,
    funciones varchar(100),
    modificado timestamp DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO TFG_versiones (tabla)
VALUES ('tfg_contactos');

CREATE TRIGGER trigger_actualizar_version_contactos
AFTER INSERT OR UPDATE OR DELETE ON TFG_contactos
FOR EACH ROW
EXECUTE PROCEDURE actualizar_version();

create table TFG_contacto_empresa(
    cif_empre varchar(12) references TFG_empresa(cif),
    contacto_n integer references TFG_contactos(n),
    primary key (cif_empre,contacto_n)
);

create table TFG_puestos(
    cod integer primary key GENERATED ALWAYS AS IDENTITY,
    anyo integer,
    vacantes integer,
    descrip varchar(200),
    horario varchar(100),
    ciclo varchar(50) check (ciclo in ('FPB','SMR','DAM','DAW','ASIR','IMSA')),
    modificado timestamp DEFAULT CURRENT_TIMESTAMP,
    cif_empresa varchar(12) REFERENCES TFG_empresa(cif)
);

INSERT INTO TFG_versiones (tabla)
VALUES ('tfg_puestos');

CREATE TRIGGER trigger_actualizar_version_puestos
AFTER INSERT OR UPDATE OR DELETE ON TFG_puestos
FOR EACH ROW
EXECUTE PROCEDURE actualizar_version();



CREATE TRIGGER trigger_actualizar_version_profesores
AFTER INSERT OR UPDATE OR DELETE ON TFG_profesores
FOR EACH ROW
EXECUTE PROCEDURE actualizar_version();

create table TFG_anotaciones(
    codigo integer primary key GENERATED ALWAYS AS IDENTITY,
    contacto_n integer references TFG_contactos(n),
    profesor_dni varchar(12) references TFG_profesores(dni),
    anyo integer,
    fecha date,
    tipo varchar(20) check (tipo in ('Teléfono','Correo','Persona')),
    confirmado boolean,
    anotacion varchar(255),
    modificado timestamp DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO TFG_versiones (tabla)
VALUES ('tfg_anotaciones');

CREATE TRIGGER trigger_actualizar_version_anotaciones
AFTER INSERT OR UPDATE OR DELETE ON TFG_anotaciones
FOR EACH ROW
EXECUTE PROCEDURE actualizar_version();



