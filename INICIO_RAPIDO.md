# 🏥 Tienda Virtual - Guía de Inicio Rápido

## ✅ Estado Actual

### Backend (NestJS + TypeORM)
- ✅ Compilación exitosa
- ✅ Dependencias instaladas (753 paquetes)
- ✅ CORS configurado
- ✅ Prefijo global `/api` agregado
- ✅ Autenticación JWT implementada
- ✅ Base de datos MySQL conectada

### Frontend (React + Vite)
- ✅ Compilación exitosa
- ✅ Dependencias instaladas (260 paquetes)
- ✅ Conexión a API configurada
- ✅ Autenticación con context API
- ✅ Manejo de carrito con localStorage

---

## 🚀 Iniciar la Aplicación

### Terminal 1 - Backend
```bash
cd d:\backend\Hospital\Tienda\backend
npm run start:dev
```
**Resultado esperado:** Backend escuchando en `http://localhost:3000`
```
[Nest] 12345 - 06/06/2026, 10:00:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345 - 06/06/2026, 10:00:01 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
```

### Terminal 2 - Frontend
```bash
cd d:\backend\Hospital\Tienda\frontend
npm run dev
```
**Resultado esperado:** Frontend disponible en `http://localhost:5173`
```
VITE v8.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

---

## 📋 Rutas de API Disponibles

### Autenticación
- `POST /api/auth/login` - Login de usuario

### Productos
- `GET /api/productos` - Listar todos los productos
- `POST /api/productos` - Crear producto (requiere autenticación)
- `GET /api/productos/:id` - Obtener un producto
- `PATCH /api/productos/:id` - Actualizar producto (requiere autenticación)
- `DELETE /api/productos/:id` - Eliminar producto (requiere autenticación)

### Categorías
- `GET /api/categorias` - Listar categorías
- `POST /api/categorias` - Crear categoría
- `PATCH /api/categorias/:id` - Actualizar categoría
- `DELETE /api/categorias/:id` - Eliminar categoría

### Carrito (Protegidas - Requieren JWT)
- `GET /api/carrito` - Ver mi carrito
- `POST /api/carrito` - Agregar producto al carrito

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `POST /api/pedidos` - Crear pedido

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario

---

## 🔧 Configuración de Variables de Entorno

### Backend (.env)
```
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=essen_ecommerce
JWT_SECRET=MI_PALABRA_SECRETA_SÚPER_SEGURA
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

---

## 🔐 Autenticación

### Flujo de Login
1. Usuario entra credenciales en `/login`
2. Frontend envía `POST /api/auth/login` con email y password
3. Backend valida y retorna `token` y `userData`
4. Frontend almacena en `localStorage` (token y user)
5. Los interceptores incluyen el token automáticamente

### Headers Enviados
```
Authorization: Bearer <token>
```

---

## 💾 Base de Datos

### Conexión
- **Host:** localhost
- **Puerto:** 3306
- **Usuario:** root
- **BD:** essen_ecommerce
- **Tipo:** MySQL

### Entidades Principales
- **Usuario** - Información de usuarios (admin/cliente)
- **Producto** - Catálogo de productos
- **Categoría** - Categorías de productos
- **Carrito** - Items en carrito (por usuario)
- **Pedido** - Órdenes de compra
- **DetallePedido** - Items de cada pedido

---

## ❌ Problemas Comunes

### "Error: connect ECONNREFUSED 127.0.0.1:3306"
**Solución:** Verifica que MySQL está corriendo
```bash
# Windows
net start MySQL80

# O abre MySQL Workbench
```

### "Token is invalid or has expired"
**Solución:** Limpia el localStorage en el navegador
```javascript
localStorage.clear();
location.reload();
```

### Frontend no se conecta al backend
**Solución:** Verifica que:
1. Backend está corriendo en puerto 3000
2. El .env frontend tiene `VITE_API_URL=http://localhost:3000/api`
3. CORS está habilitado (está configurado en main.ts)

---

## 📊 Cambios Realizados

1. ✅ Agregado prefijo global `/api` en `main.ts`
2. ✅ Importado `AuthModule` en `app.module.ts`
3. ✅ Corregida respuesta de login (token/userData)
4. ✅ Actualizados tipos de TypeORM (relations y select)
5. ✅ Creados archivos `.env`
6. ✅ Corregida estructura de módulos
7. ✅ Compilación exitosa de ambos proyectos

---

## 🧪 Test Rápido

### Crear usuario (via curl o Postman)
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Respuesta esperada
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userData": {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@example.com",
    "rol": "admin"
  }
}
```

---

## 📞 Soporte

Si encuentras errores:
1. Revisa la consola del backend (Terminal 1)
2. Revisa la consola del navegador (F12)
3. Verifica el estado de MySQL
4. Confirma que los puertos 3000 y 5173 estén libres
