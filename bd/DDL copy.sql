CREATE TABLE tfg_versiones (
	tabla varchar(60) NOT NULL,
	version_n int4 NULL DEFAULT 0,
	CONSTRAINT tfg_versiones_pkey PRIMARY KEY (tabla)
);

CREATE TABLE tfg_empresa (
	cif varchar(12) NOT NULL,
	nombre varchar(60) NULL,
	localidad varchar(50) NULL,
	comunidad varchar(50) NULL,
	direccion varchar(100) NULL,
	telefono int4 NULL,
	modificado timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	profesor_encargado varchar(12) NULL,
	CONSTRAINT tfg_empresa_pkey PRIMARY KEY (cif),
	CONSTRAINT tfg_empresa_profesor_encargado_fkey FOREIGN KEY (profesor_encargado) REFERENCES  tfg_profesores(dni)
);

-- Table Triggers

create trigger trigger_actualizar_version_empresa after
insert or delete or update on
     tfg_empresa for each row execute function actualizar_version();


CREATE TABLE tfg_contactos (
	n int4 NOT NULL GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE),
	nombre varchar(100) NULL,
	correo varchar(100) NULL,
	telefono int4 NULL,
	dni varchar(10) NULL,
	tipo varchar(20) NULL,
	principal bool NULL,
	funciones varchar(100) NULL,
	modificado timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tfg_contactos_pkey PRIMARY KEY (n),
	CONSTRAINT tfg_contactos_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Gerente'::character varying, 'Jefe Proyecto'::character varying, 'Técnico'::character varying, 'Tutor'::character varying, 'RRHH'::character varying])::text[])))
);

-- Table Triggers

create trigger trigger_actualizar_version_contactos after
insert or delete or
update on
    tfg_contactos for each row execute function actualizar_version();

CREATE TABLE  tfg_contacto_empresa (
	cif_empre varchar(12) NOT NULL,
	contacto_n int4 NOT NULL,
	CONSTRAINT tfg_contacto_empresa_pkey PRIMARY KEY (cif_empre, contacto_n),
	CONSTRAINT tfg_contacto_empresa_cif_empre_fkey FOREIGN KEY (cif_empre) REFERENCES  tfg_empresa(cif),
	CONSTRAINT tfg_contacto_empresa_contacto_n_fkey FOREIGN KEY (contacto_n) REFERENCES  tfg_contactos(n)
);

CREATE TABLE  tfg_puestos (
	cod int4 NOT NULL,
	anyo int4 NULL,
	vacantes int4 NULL,
	descrip varchar(200) NULL,
	horario varchar(100) NULL,
	ciclo varchar(50) NULL,
	modificado timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	cif_empresa varchar(12) NULL,
	CONSTRAINT tfg_puestos_ciclo_check CHECK (((ciclo)::text = ANY ((ARRAY['FPB'::character varying, 'SMR'::character varying, 'DAM'::character varying, 'DAW'::character varying, 'ASIR'::character varying])::text[]))),
	CONSTRAINT tfg_puestos_pkey PRIMARY KEY (cod),
	CONSTRAINT tfg_puestos_cif_empresa_fkey FOREIGN KEY (cif_empresa) REFERENCES  tfg_empresa(cif)
);


CREATE TABLE  tfg_profesores (
	dni varchar(12) NOT NULL,
	nombre varchar(100) NULL,
	telefono int4 NULL,
	contrasena varchar(255) NULL,
	modificado timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	correo varchar(100) NULL,
	"admin" varchar(10) NULL DEFAULT 'user'::character varying,
	CONSTRAINT tfg_profesores_admin_check CHECK (((admin)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[]))),
	CONSTRAINT tfg_profesores_pkey PRIMARY KEY (dni)
);

-- Table Triggers

create trigger trigger_actualizar_version_profesores after
insert
    or
delete
    or
update
    on
     tfg_profesores for each row execute function actualizar_version();


CREATE TABLE  tfg_anotaciones (
	contacto_n int4 NOT NULL,
	profesor_dni varchar(12) NOT NULL,
	anyo int4 NOT NULL,
	fecha date NULL,
	tipo varchar(20) NULL,
	confirmado bool NULL,
	conversacion varchar(255) NULL,
	modificado timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tfg_anotaciones_pkey PRIMARY KEY (contacto_n, profesor_dni, anyo),
	CONSTRAINT tfg_anotaciones_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Teléfono'::character varying, 'Correo'::character varying, 'Persona'::character varying])::text[]))),
	CONSTRAINT tfg_anotaciones_contacto_n_fkey FOREIGN KEY (contacto_n) REFERENCES  tfg_contactos(n),
	CONSTRAINT tfg_anotaciones_profesor_dni_fkey FOREIGN KEY (profesor_dni) REFERENCES  tfg_profesores(dni)
);

-- Table Triggers

create trigger trigger_actualizar_version_anotaciones after
insert
    or
delete
    or
update
    on
     tfg_anotaciones for each row execute function actualizar_version();