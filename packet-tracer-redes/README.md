# Redes de Computadoras - Arbolito S.A.

Este proyecto corresponde a un **trabajo integrador de la materia Redes de Computadoras**, desarrollado utilizando **Cisco Packet Tracer**.  

El objetivo principal fue diseñar, implementar y validar una **infraestructura de red completa** para la empresa ficticia **Arbolito S.A.**, integrando todos los contenidos vistos durante la cursada.

El proyecto contempla el diseño por capas del modelo OSI, la segmentación lógica mediante VLANs, el ruteo entre múltiples sedes, la provisión de servicios de red y la emulación completa del funcionamiento de la red.



## Contexto del Proyecto

Arbolito S.A. cuenta con **tres sedes**:

- **CABA** (sede principal)
- **Santa Fe**
- **Río Negro**

Las sedes se encuentran interconectadas mediante enlaces **punto a punto por fibra óptica**, con salida a Internet centralizada en la sede de CABA, donde se implementa **NAT y PAT**.

Todo el diseño fue implementado y probado en un entorno de **emulación**, verificando conectividad, servicios y segmentación.



## Diseño de la Red

### Capa Física
- Cableado estructurado con topología jerárquica.
- Enlaces **Gigabit Ethernet por fibra óptica** entre sedes y entre pisos (aislamiento galvánico).
- Enlaces seriales punto a punto hacia el ISP.
- Uso de switches principales y switches de acceso por piso y sector.

### Capa de Enlace
- Segmentación lógica mediante **VLANs** en la sede de CABA.
- Configuración de enlaces **trunk 802.1Q**.
- VLANs definidas por áreas funcionales:
  - Administración
  - Logística
  - Gerencia
  - Sistemas y Centro de Datos

### Capa de Red
- Subneteo completo respetando los bloques asignados por el enunciado.
- Direccionamiento IP privado para redes internas.
- Enlaces punto a punto /30 entre routers.
- Ruteo **estático** entre todas las sedes.
- Implementación de **NAT estático** para servidores públicos.
- Implementación de **PAT** para salida a Internet de los usuarios internos.



## Servicios Implementados

### Servicios de Red
- **DHCP**, segmentado por sede y por VLAN.
- **DNS público y privado**, con servidores primarios y secundarios.
- **Ruteo estático** entre todas las redes.
- **Sniffers** para análisis de tráfico interno y externo.

### Servicios de Capa de Aplicación
- Servidores **Web HTTP**.
- Servidores **Web HTTPS** (Intranet y sistema de logística).
- **Servidor de correo electrónico** (SMTP / POP3 / IMAP).
- **Wi-Fi** en todas las sedes (WPA2-PSK con AES).
- **Impresoras de red**.
- **Teléfonos IP** integrados a la red de datos.



## Emulación

La red fue completamente emulada en **Cisco Packet Tracer**, incluyendo:

- Routers, switches, servidores y dispositivos finales.
- Servicios configurados y funcionales.
- Verificación de conectividad entre sedes.
- Acceso a Internet desde todas las redes internas.
- Publicación de servicios hacia Internet mediante IPs públicas.



## Objetivos Académicos

- Integrar todos los conceptos vistos en la materia.
- Diseñar redes respetando el modelo OSI.
- Aplicar correctamente subneteo y direccionamiento IP.
- Implementar segmentación mediante VLANs.
- Comprender y aplicar NAT/PAT.
- Configurar servicios de red y de aplicación.
- Analizar tráfico y comportamiento de la red.
- Validar el diseño mediante emulación.



## Conclusiones

El proyecto permitió consolidar los conocimientos teóricos y prácticos de redes de computadoras, logrando una red funcional, segmentada y segura.  
La emulación confirmó que el diseño cumple con los requerimientos planteados y refleja un enfoque realista y ordenado del diseño de redes empresariales.
