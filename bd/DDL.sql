create table TFG_empresa(
    cif varchar(12) primary key,
    nombre varchar(60),
    localidad varchar(50),
    comunidad varchar(50),
    direccion varchar(100),
    telefono integer
);

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

create table TFG_profesores(
    dni varchar(12) primary key,
    nombre varchar(100),
    telefono integer,
    contrasena VARCHAR(255)
);

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