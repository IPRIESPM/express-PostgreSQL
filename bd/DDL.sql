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

create table TFG_empresa(
    cif varchar(12) primary key,
    nombre varchar(60),
    localidad varchar(50),
    comunidad varchar(50),
    direccion varchar(100),
    telefono integer
);

INSERT INTO TFG_versiones (tabla, version_n)
VALUES ('tfg_empresa');

CREATE TRIGGER trigger_actualizar_version
AFTER INSERT OR UPDATE OR DELETE ON TFG_empresa
FOR EACH ROW
EXECUTE PROCEDURE actualizar_version();


create table TFG_contactos(
    n integer primary key,
    nombre varchar(100),
    correo varchar(100),
    telefono integer,
    dni varchar(10),
    tipo varchar(20) check (tipo in ('Gerente','Jefe Proyecto','Técnico','Tutor','RRHH')),
    principal boolean,
    funciones varchar(100)
);

INSERT INTO TFG_contactos (tabla, version_n)
VALUES ('tfg_contactos');

CREATE TRIGGER trigger_actualizar_version
AFTER INSERT OR UPDATE OR DELETE ON TFG_contactos
FOR EACH ROW
EXECUTE PROCEDURE actualizar_version();

create table TFG_contacto_empresa(
    cif_empre varchar(12) references TFG_empresa,
    contacto_n integer references TFG_contactos,
    primary key (cif_empre,contacto_n)
);

create table TFG_puestos(
    cod integer primary key,
    anyo integer,
    vacantes integer,
    descrip varchar(200),
    horario varchar(100),
    ciclo varchar(50) check (ciclo in ('FPB','SMR','DAM','DAW','ASIR'))
);

INSERT INTO TFG_puestos (tabla, version_n)
VALUES ('tfg_puestos');

CREATE TRIGGER trigger_actualizar_version
AFTER INSERT OR UPDATE OR DELETE ON TFG_puestos
FOR EACH ROW
EXECUTE PROCEDURE actualizar_version();

create table TFG_profesores(
    dni varchar(12) primary key,
    nombre varchar(100),
    telefono integer,
    contrasena VARCHAR(255)
);

INSERT INTO TFG_profesores (tabla, version_n)
VALUES ('tfg_profesores');

CREATE TRIGGER trigger_actualizar_version
AFTER INSERT OR UPDATE OR DELETE ON TFG_profesores
FOR EACH ROW
EXECUTE PROCEDURE actualizar_version();

create table TFG_anotaciones(
    contacto_n integer references TFG_contactos,
    profesor_dni varchar(12) references TFG_profesores,
    anyo integer,
    fecha date,
    tipo varchar(20) check (tipo in ('Teléfono','Correo','Persona')),
    confirmado boolean,
    conversacion varchar(255),
    primary key (contacto_n,profesor_dni,anyo)
);

INSERT INTO TFG_anotaciones (tabla, version_n)
VALUES ('tfg_anotaciones');

CREATE TRIGGER trigger_actualizar_version
AFTER INSERT OR UPDATE OR DELETE ON TFG_anotaciones
FOR EACH ROW
EXECUTE PROCEDURE actualizar_version();