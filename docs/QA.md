# LJAgenda Backend API - QA Automation

Esta colección agrupa la suite de pruebas QA del backend de LJAgenda y centraliza los endpoints necesarios para validar los principales flujos funcionales de la API. Su propósito es facilitar la ejecución y mantenimiento de pruebas sobre autenticación, gestión de citas y entidades operativas del dominio médico.

La colección utiliza autenticación de tipo bearer a nivel general mediante la variable `{{jwtToken}}`, por lo que las solicitudes protegidas requieren contar con un token válido antes de su ejecución. Además, hace uso de variables reutilizables como `{{baseUrl}}` para parametrizar el entorno y de identificadores dinámicos como `{{appointmentId}}`, `{{doctorId}}`, `{{serviceId}}` y otros similares para encadenar escenarios de prueba y reutilizar datos entre requests.

Los dominios cubiertos por esta suite son: Auth, Appointments, Doctors, Doctor Availability, Doctor Blocks, Doctor Schedule Blocks, Patients y Services. En conjunto, estos recursos permiten validar operaciones CRUD, consultas específicas, reglas de disponibilidad y restricciones de agenda relevantes para la automatización QA.

---

## 1. Auth
Contiene los endpoints de autenticación de la API. Esta carpeta se usa para obtener y validar el token bearer requerido por la suite, verificando el acceso autorizado antes de ejecutar pruebas sobre los demás dominios.

### [POST] Login
`{{baseUrl}}/auth/login`

Autentica a un usuario en el sistema mediante sus credenciales y devuelve la información necesaria para iniciar sesión.

#### Body (json)
```json
{
  "email": "doctor.qa@correo.com",
  "password": "Passw0rd.QA!"
}
2. Appointments
Agrupa los endpoints para crear, consultar y gestionar citas médicas. Incluye operaciones de disponibilidad, confirmación, cancelación, reasignación, finalización e inasistencia, orientadas a validar el ciclo funcional completo de una cita.

[POST] Create Appointment
{{baseUrl}}/appointment

Crea una nueva cita en el sistema con los datos enviados en la solicitud.

Body (raw json)
JSON
{
  "doctorId": "{{doctorId}}",
  "serviceId": "{{serviceId}}",
  "identificationType": "CC",
  "identification": "1023456789",
  "name": "Juan Pérez García",
  "phone": "3001234567",
  "email": "paciente.qa@correo.com",
  "appointmentDate": "2026-08-10",
  "appointmentTime": "09:00",
  "observations": "Consulta de control"
}
[GET] Get Available Slots
{{baseUrl}}/appointment/available-slots?doctorId={{doctorId}}&serviceId={{serviceId}}&date=2026-08-10

Consulta los horarios disponibles para agendar una cita, usando como filtros principales los query params doctorId, serviceId y date.

Query Params
doctorId: {{doctorId}}

serviceId: {{serviceId}}

date: 2026-08-10

[GET] Get Appointments
{{baseUrl}}/appointment

Recupera la lista de citas registradas en el sistema para consulta y validación en pruebas QA.

Query Params
doctorId

patientId

status

date

[GET] Get Appointment by ID
{{baseUrl}}/appointment/{{appointmentId}}

Obtiene el detalle de una cita específica a partir del parámetro de ruta appointmentId.

[PATCH] Confirm Appointment
{{baseUrl}}/appointment/{{appointmentId}}/confirm

Confirma una cita existente mediante su identificador appointmentId, actualizando su estado para reflejar que ha sido confirmada.

[PATCH] Cancel Appointment
{{baseUrl}}/appointment/{{appointmentId}}/cancel

Cancela una cita específica mediante appointmentId, cambiando su estado para reflejar que ya no será atendida.

[PATCH] Reschedule Appointment
{{baseUrl}}/appointment/{{appointmentId}}/reschedule

Reagenda una cita existente identificada por appointmentId, permitiendo actualizar su fecha u horario programado.

Body (raw json)
JSON
{
  "appointmentDate": "2026-08-11",
  "appointmentTime": "10:30"
}
[PATCH] Complete Appointment
{{baseUrl}}/appointment/{{appointmentId}}/complete

Marca como completada una cita específica usando appointmentId, indicando que la atención fue realizada.

[PATCH] No-Show Appointment
{{baseUrl}}/appointment/{{appointmentId}}/no-show

Marca una cita existente como inasistencia usando el parámetro de ruta appointmentId, indicando que el paciente no se presentó.

3. Doctors
Reúne los endpoints para administrar la información de doctores. Permite validar altas, consultas, actualizaciones y eliminación lógica o funcional de profesionales dentro del sistema.

[POST] Create Doctor
{{baseUrl}}/doctors

Crea un nuevo doctor en el sistema con la información enviada en la solicitud.

Body (raw json)
JSON
{
  "name": "Dr. Carlos Ramírez",
  "email": "doctor.qa@correo.com",
  "password": "Passw0rd.QA!",
  "clinicName": "Clínica Salud Total",
  "slotGap": 30
}
[GET] Get Doctors
{{baseUrl}}/doctors

Obtiene la lista de doctores disponibles en el sistema para consulta y validación funcional.

[GET] Get Doctor by ID
{{baseUrl}}/doctors/{{doctorId}}

Obtiene el detalle de un doctor específico a partir del parámetro de ruta doctorId.

[PATCH] Update Doctor
{{baseUrl}}/doctors/{{doctorId}}

Actualiza la información de un doctor existente usando el parámetro de ruta doctorId.

Body (raw json)
JSON
{
  "name": "Dr. Carlos Ramírez Actualizado",
  "clinicName": "Clínica Salud Total Plus",
  "slotGap": 20
}
[DELETE] Delete Doctor
{{baseUrl}}/doctors/{{doctorId}}

Elimina un doctor específico del sistema mediante el parámetro de ruta doctorId.

4. Doctor Availability
Contiene los endpoints relacionados con la disponibilidad de atención de los doctores. Esta carpeta permite validar la creación, consulta, actualización y eliminación de franjas disponibles para agendamiento.

[POST] Create Doctor Availability
{{baseUrl}}/doctor-availability

Crea una nueva disponibilidad de doctor con la información enviada en la solicitud.

Body (raw json)
JSON
{
  "doctorId": "{{doctorId}}",
  "day": "MONDAY",
  "startTime": "08:00",
  "endTime": "12:00"
}
[GET] Get Doctor Availabilities
{{baseUrl}}/doctor-availability

Recupera la lista de disponibilidades de doctores registradas en el sistema.

[GET] Get Doctor Availability by ID
{{baseUrl}}/doctor-availability/{{availabilityId}}

Obtiene el detalle de una disponibilidad de doctor específica a partir del parámetro de ruta availabilityId.

[PATCH] Update Doctor Availability
{{baseUrl}}/doctor-availability/{{availabilityId}}

Actualiza una disponibilidad de doctor existente usando el parámetro de ruta availabilityId.

Body (raw json)
JSON
{
  "doctorId": "{{doctorId}}",
  "day": "TUESDAY",
  "startTime": "09:00",
  "endTime": "13:00"
}
[DELETE] Delete Doctor Availability
{{baseUrl}}/doctor-availability/{{availabilityId}}

Elimina una disponibilidad de doctor específica mediante el parámetro de ruta availabilityId.

5. Doctor Blocks
Incluye los endpoints para gestionar bloqueos de agenda asociados a doctores. Se utiliza para probar restricciones temporales que impiden la asignación de citas en periodos específicos.

[POST] Create Doctor Block
{{baseUrl}}/doctor-block

Crea un nuevo bloqueo de agenda para un doctor con los datos enviados en la solicitud.

Body (raw json)
JSON
{
  "doctorId": "{{doctorId}}",
  "startDate": "2026-08-10T00:00:00.000Z",
  "endDate": "2026-08-15T23:59:59.000Z",
  "reason": "Vacaciones programadas"
}
[GET] Get Doctor Blocks
{{baseUrl}}/doctor-block

Obtiene la lista de bloqueos de agenda de doctores registrados en el sistema.

[GET] Get Doctor Block by ID
{{baseUrl}}/doctor-block/{{doctorBlockId}}

Obtiene el detalle de un bloqueo de agenda de doctor específico a partir del parámetro de ruta doctorBlockId.

[PATCH] Update Doctor Block
{{baseUrl}}/doctor-block/{{doctorBlockId}}

Actualiza un bloqueo de agenda de doctor existente usando el parámetro de ruta doctorBlockId.

Body (raw json)
JSON
{
  "doctorId": "{{doctorId}}",
  "startDate": "2026-08-12T00:00:00.000Z",
  "endDate": "2026-08-17T23:59:59.000Z",
  "reason": "Vacaciones reprogramadas"
}
[DELETE] Delete Doctor Block
{{baseUrl}}/doctor-block/{{doctorBlockId}}

Elimina un bloqueo de agenda de doctor específico mediante el parámetro de ruta doctorBlockId.

6. Doctor Schedule Blocks
Agrupa los endpoints destinados a bloquear segmentos dentro del calendario o la programación del doctor. Permite validar reglas operativas sobre intervalos no disponibles en la agenda.

[POST] Create Doctor Schedule Block
{{baseUrl}}/doctor-schedule-block

Crea un nuevo bloqueo de horario para un doctor con los datos enviados en la solicitud.

Body (raw json)
JSON
{
  "doctorId": "{{doctorId}}",
  "date": "2026-08-10",
  "startTime": "10:00",
  "endTime": "11:00",
  "reason": "Reunión de equipo médico"
}
[GET] Get Doctor Schedule Blocks
{{baseUrl}}/doctor-schedule-block

Obtiene la lista de bloqueos de horario de doctores registrados en el sistema.

[GET] Get Doctor Schedule Block by ID
{{baseUrl}}/doctor-schedule-block/{{scheduleBlockId}}

Obtiene el detalle de un bloqueo de horario de doctor específico a partir del parámetro de ruta scheduleBlockId.

[PATCH] Update Doctor Schedule Block
{{baseUrl}}/doctor-schedule-block/{{scheduleBlockId}}

Actualiza un bloqueo de horario de doctor existente usando el parámetro de ruta scheduleBlockId.

Body (raw json)
JSON
{
  "doctorId": "{{doctorId}}",
  "date": "2026-08-11",
  "startTime": "11:00",
  "endTime": "12:00",
  "reason": "Capacitación interna"
}
[DELETE] Delete Doctor Schedule Block
{{baseUrl}}/doctor-schedule-block/{{scheduleBlockId}}

Elimina un bloqueo de horario de doctor específico mediante el parámetro de ruta scheduleBlockId.

7. Patients
Contiene los endpoints para administrar pacientes dentro de la plataforma. Permite validar registro, consulta, actualización y demás operaciones necesarias para el mantenimiento de datos clínico-administrativos básicos.

[POST] Create Patient
{{baseUrl}}/patients

Crea un nuevo paciente en el sistema con los datos enviados en la solicitud.

Body (raw json)
JSON
{
  "identificationType": "CC",
  "identification": "1023456789",
  "name": "María López Torres",
  "phone": "3109876543",
  "email": "paciente.qa@correo.com"
}
[GET] Get Patients
{{baseUrl}}/patients

Recupera la lista de pacientes registrados en el sistema para consulta y validación funcional.

[GET] Get Patient by ID
{{baseUrl}}/patients/{{patientId}}

Obtiene el detalle de un paciente específico a partir del parámetro de ruta patientId.

[PATCH] Update Patient
{{baseUrl}}/patients/{{patientId}}

Actualiza la información de un paciente existente usando el parámetro de ruta patientId.

Body (raw json)
JSON
{
  "identificationType": "CC",
  "identification": "1023456789",
  "name": "María López Torres Actualizada",
  "phone": "3209876543",
  "email": "paciente.actualizado@correo.com"
}
[DELETE] Delete Patient
{{baseUrl}}/patients/{{patientId}}

Elimina un paciente específico del sistema mediante el parámetro de ruta patientId.

8. Services
Reúne los endpoints para gestionar los servicios ofrecidos por la agenda médica. Esta carpeta permite validar altas, consultas, modificaciones y eliminación de servicios utilizados en el flujo de citas.

[POST] Create Service
{{baseUrl}}/services

Crea un nuevo servicio en el sistema con la información enviada en la solicitud.

Body (raw json)
JSON
{
  "doctorId": "{{doctorId}}",
  "name": "Consulta General",
  "description": "Consulta médica general de 30 minutos",
  "duration": 30,
  "basePrice": 50000,
  "active": true
}
[GET] Get Services
{{baseUrl}}/services

Recupera la lista de servicios registrados en el sistema para consulta y validación funcional.

[GET] Get Service by ID
{{baseUrl}}/services/{{serviceId}}

Obtiene el detalle de un servicio específico a partir del parámetro de ruta serviceId.

[PATCH] Update Service
{{baseUrl}}/services/{{serviceId}}

Actualiza la información de un servicio existente usando el parámetro de ruta serviceId.

Body (raw json)
JSON
{
  "doctorId": "{{doctorId}}",
  "name": "Consulta Especializada",
  "description": "Consulta médica especializada de 45 minutos",
  "duration": 45,
  "basePrice": 80000,
  "active": true
}
[DELETE] Delete Service
{{baseUrl}}/services/{{serviceId}}

Elimina un servicio específico del sistema mediante el parámetro de ruta serviceId.