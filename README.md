<div style="text-align:center; margin-bottom:10px;">
  <!-- Replace `logo.png` with your actual logo path or URL -->
  <h1 style="margin:0;">Sistema de Gestión de Horarios (SGH)</h1><img src="https://media.discordapp.net/attachments/1340137547778621549/1420232469789151262/image.png?ex=68d4a60f&is=68d3548f&hm=3b8772be24acfd7d9ec25cf8e0bb1136c97b64c54ab1240625e44ad6971bdc6f&=&format=webp&quality=lossless&width=1266&height=919" alt="Bytestock Logo" width="350" style="display:block; margin:0 auto 12px;"/>
  <p style="margin-top:6px; font-style:italic;">Desarrollado por el equipo <strong>Bytestock</strong></p>
</div>

<hr />

<p><strong>Institución:</strong> SENA<br>
<strong>Ficha:</strong> 2899747</p>

<h2>Autores</h2>
<ul>
  <li><b>Juan Pablo Saavedra Chambo</b></li>
  <li><b>Martin Stiben Narváez</b></li>
  <li><b>Racinger Prada Olaya</b></li>
  <li><b>Juan Sebastián Gonzalez Horta</b></li>
</ul>

<h2>Resumen del proyecto</h2>
<p>
El <strong>Sistema de Gestión de Horarios (SGH)</strong> tiene el potencial de mejorar significativamente la administración de horarios en el colegio <em>ABC</em>. Su diseño prioriza la facilidad de uso e integración con herramientas de productividad ya existentes, permitiendo a docentes y administrativos gestionar, consultar y sincronizar horarios de forma rápida y confiable.
</p>

<p>
La vigilancia tecnológica realizada durante la fase de análisis permitió identificar oportunidades y amenazas que guiarán el desarrollo hacia una solución eficiente y competitiva. Nuestra propuesta se diferencia por una integración más intuitiva con plataformas de productividad y un enfoque específico en instituciones educativas, posicionándose en un nicho poco explorado.
</p>

<h2>Tecnologías utilizadas</h2>

<h3>Backend</h3>
<ul>
  <li>Lenguajes: JavaScript, Java (Spring Boot)</li>
  <li>Framework: Spring Boot (APIs REST)</li>
  <li>Base de datos: MySQL</li>
  <li>APIs: RESTful endpoints desarrollados con Spring Boot</li>
</ul>

<h3>Frontend</h3>
<ul>
  <li>Aplicación web: React.js</li>
  <li>Estilos: Tailwind CSS</li>
  <li>Aplicación móvil: React Native</li>
</ul>

<h2>Características principales</h2>
<ul>
  <li>Gestión y asignación de horarios para cursos, profesores y aulas.</li>
  <li>Panel de administración con CRUD para entidades: usuarios, cursos, aulas, horarios.</li>
  <li>Sincronización e integración con herramientas de productividad (calendarios externos).</li>
  <li>Interfaz web responsive y aplicación móvil para consulta rápida.</li>
  <li>Roles de usuario: Administrador, Coordinador, Docente y Estudiante (según alcance del despliegue).</li>
  <li>Notificaciones (opcional) para cambios de horario.</li>
</ul>

<h2>Arquitectura (resumen)</h2>
<p>
SGH sigue una arquitectura cliente–servidor con una API REST central (Spring Boot). La persistencia de datos se realiza en MySQL. El frontend web (React.js + Tailwind) consume los endpoints del backend, y la app móvil (React Native) reutiliza la misma API para mantener coherencia entre plataformas.
</p>

<h2>Instalación y puesta en marcha (resumen)</h2>

<h3>Requisitos previos</h3>
<ul>
  <li>Node.js (versión LTS recomendada)</li>
  <li>Java JDK 11+</li>
  <li>Maven o Gradle (según el build del backend)</li>
  <li>MySQL (o MariaDB) y cliente para administración (MySQL Workbench, phpMyAdmin, etc.)</li>
  <li>Yarn o npm para frontend</li>
</ul>

<h3>Base de datos</h3>
<ol>
  <li>Crear la base de datos: <code>CREATE DATABASE sgh;</code></li>
  <li>Ejecutar los scripts SQL de inicialización (tablas, relaciones, seeders opcionales).</li>
  <li>Configurar las credenciales en el archivo de propiedades del backend (application.properties / application.yml).</li>
</ol>

<h3>Backend (Spring Boot)</h3>
<pre><code>// En el directorio del backend
mvn clean install
mvn spring-boot:run
</code></pre>

<p>Asegúrate de configurar la conexión a MySQL en <code>src/main/resources/application.properties</code> o <code>application.yml</code>.</p>

<h3>Frontend (React)</h3>
<pre><code>// En el directorio del frontend
npm install
npm run dev
// o
npm start
</code></pre>

<h3>Aplicación móvil (React Native)</h3>
<p>Seguir el flujo estándar de React Native: instalar dependencias, configurar emulador o dispositivo físico y ejecutar con <code>npx react-native run-android</code> / <code>run-ios</code> según corresponda.</p>

<h2>Rutas y Endpoints (ejemplo)</h2>
<ul>
  <li><code>GET /api/courses</code> — Listar cursos</li>
  <li><code>POST /api/schedules</code> — Crear horario</li>
  <li><code>GET /api/teachers/{id}/schedules</code> — Obtener horarios por docente</li>
  <li><em>...otros endpoints CRUD</em></li>
</ul>

<h2>Buenas prácticas y recomendaciones</h2>
<ul>
  <li>Usar variables de entorno para credenciales y secretos.</li>
  <li>Versionar la API (ej: <code>/api/v1/</code>).</li>
  <li>Implementar autenticación y autorización (JWT o similar) antes de producción.</li>
  <li>Agregar pruebas unitarias y de integración para endpoints críticos.</li>
</ul>

<h2>Contribuciones</h2>
<p>Si deseas contribuir al proyecto:</p>
<ol>
  <li>Fork del repositorio.</li>
  <li>Crear una rama con tu feature o corrección (<code>feature/mi-cambio</code>).</li>
  <li>Enviar un pull request describiendo los cambios.</li>
</ol>

<h2>Contacto</h2>
<p>Equipo Bytestock — Para dudas, soporte o propuestas de integración, contactar a los autores listados arriba o abrir un issue en el repositorio.</p>

<h2>Licencia</h2>
<p>Este proyecto puede usar la licencia que prefiera el equipo (por ejemplo, MIT). Añade un archivo <code>LICENSE</code>
