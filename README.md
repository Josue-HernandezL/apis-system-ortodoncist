
# 🦷 API Backend - Sistema Web de Gestión Ortodoncista

![Licencia Personalizada](https://img.shields.io/badge/Licencia-Uso%20Condicional-blue)

Este repositorio contiene el backend de la aplicación web diseñada para gestionar **citas, pacientes, pagos e inventario** en un consultorio dental.  
Está desarrollado en **Node.js + Express** y conectado a **Firebase Realtime Database** mediante autenticación con archivo de servicio.

---

## 📁 Estructura del proyecto

```
/apis-system-ortodoncist
│
├── firebaseConfig.js
├── routes/
│   ├── pacientes.js
│   ├── citas.js
│   ├── pagos.js
│   └── inventario.js
├── serviceAccountKey.json
├── .env
├── index.js
└── README.md
```

---

## 🔐 Clave de servicio Firebase

Este proyecto utiliza autenticación mediante archivo de clave de servicio para conectarse a Firebase.

Asegúrate de tener el archivo `serviceAccountKey.json` en la raíz del proyecto. Si ya clonaste este repositorio, el archivo ya está incluido.  
⚠️ **No compartas este archivo públicamente en producción.**

---

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con este contenido:

```env
API_KEY=tu_api_key_secreta
```

Esta API key se usará como validación en las solicitudes protegidas.

---

## 🚀 Cómo ejecutar el proyecto

1. Clona el repositorio:

```bash
git clone https://github.com/Josue-HernandezL/apis-system-ortodoncist.git
cd apis-system-ortodoncist
```

2. Instala las dependencias:

```bash
npm install
```

3. Asegúrate de tener estos archivos en la raíz:
- `serviceAccountKey.json`
- `.env`

4. Ejecuta el servidor:

```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`.

---

## 🛡️ Protección con API Key

Todas las rutas del backend están protegidas con una API Key.  
Agrega el siguiente encabezado a tus solicitudes:

```http
x-api-key: tu_api_key_secreta
```

De lo contrario, la API responderá con un error `403 - Acceso denegado`.

---

## 📜 Licencia

Este proyecto está protegido bajo una **Licencia de Uso Condicional** desarrollada por **Josué Hernández López**.

- El uso del software está permitido **únicamente con autorización expresa** del autor.
- El permiso puede ser revocado en cualquier momento, sin previo aviso.
- No se permite la redistribución, modificación o comercialización sin consentimiento.

🔒 **Este proyecto NO es de código abierto** bajo licencias estándar (MIT, GPL, Apache, etc.).  
Consulta el archivo LICENSE` para más información legal.

¿Deseas utilizar este software? Comunícate con el autor para obtener permiso:  
📧 jh6466011@gmail.com
