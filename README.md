# express-PostgreSQL

[Inspiración](https://www.atatus.com/blog/building-crud-rest-api-with-node-js-express-js-and-postgresql/)

## Estructura de las peticiones

1. Empresas:

   * GET /empresa/:cif: Obtener información de una empresa específica.
   * POST /empresa: Crear una nueva empresa.
   * PUT /empresa/:cif: Actualizar la información de una empresa existente.
   * DELETE /empresa/:cif: Eliminar una empresa.
   * GET /empresas?comunidad=:comunidad: Obtener todas las empresas de una comunidad específica.
   * GET /empresa/:cif/contactos-principales: Obtener todos los contactos principales de una empresa.

2. Contactos:

   * GET /contacto/:n: Obtener detalles de un contacto específico.
   * GET /empresa/:cif/contactos: Obtener todos los contactos de una empresa.
   * POST /empresa/:cif/contactos: Agregar un nuevo contacto a una empresa.
   * PUT /contacto/:n: Actualizar la información de un contacto existente.
   * DELETE /contacto/:n: Eliminar un contacto.
   * GET /contactos?tipo=:tipo: Obtener todos los contactos de un tipo específico (por ejemplo, "Gerente", "Técnico", etc.).
   * GET /contacto/:n/empresa: Obtener la empresa a la que pertenece un contacto específico.

3. Puestos de trabajo:

    * GET /puestos: Obtener todos los puestos de trabajo disponibles.
    * GET /puestos/:cod: Obtener detalles de un puesto de trabajo específico.
    * POST /puestos: Crear un nuevo puesto de trabajo.
    * PUT /puestos/:cod: Actualizar la información de un puesto de trabajo existente.
    * DELETE /puestos/:cod: Eliminar un puesto de trabajo.
    * GET /puestos?ciclo=:ciclo: Obtener todos los puestos de trabajo de un ciclo específico (por ejemplo, "DAM", "DAW", etc.).
    * GET /puestos/:cod/solicitantes: Obtener todos los solicitantes de un puesto de trabajo específico.

4. Profesores:

    * GET /profesor/:dni: Obtener detalles de un profesor específico.
    * POST /profesor: Crear un nuevo profesor.
    * PUT /profesor/:dni: Actualizar la información de un profesor existente.
    * DELETE /profesor/:dni: Eliminar un profesor.
    * GET /profesor/:dni/anotaciones: Obtener todas las anotaciones realizadas por un profesor específico.

5. Anotaciones:

    GET /contacto/:n/anotaciones/:dni: Obtener todas las anotaciones de un contacto y profesor específicos.
    POST /contacto/:n/anotaciones/:dni: Agregar una nueva anotación a un contacto y profesor específicos.
    PUT /contacto/:n/anotaciones/:dni/:anyo: Actualizar una anotación existente.
    DELETE /contacto/:n/anotaciones/:dni/:anyo: Eliminar una anotación.

6. Inicio sesión:

   * POST /login: Iniciar sesión en la aplicación.
   * POST /registro: Registrarse como usuario en la aplicación.
   * PUT /usuario/:id: Actualizar los datos de un usuario registrado.
