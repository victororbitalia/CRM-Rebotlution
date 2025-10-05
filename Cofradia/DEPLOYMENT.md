# 🚀 Guía de Despliegue - Cofradia CRM

Esta guía te ayudará a desplegar tu aplicación en Easypanel u otros servicios.

---

## 📦 Archivos Creados para Despliegue

- ✅ `Dockerfile` - Imagen Docker optimizada para Next.js
- ✅ `.dockerignore` - Archivos a ignorar en el build
- ✅ `docker-compose.yml` - Para desarrollo local con Docker
- ✅ `env.example` - Variables de entorno de ejemplo
- ✅ `next.config.js` - Actualizado con `output: 'standalone'`

---

## 🐳 Opción 1: Despliegue con Easypanel (RECOMENDADO)

### Método A: Desde GitHub (Más Fácil)

#### 1. Sube tu código a GitHub

```bash
# Si aún no has inicializado git
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Preparar para despliegue en Easypanel"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/cofradia.git
git branch -M main
git push -u origin main
```

#### 2. Configurar en Easypanel

1. **Accede a tu panel de Easypanel**
2. **Click en "Create Service"**
3. **Selecciona "App"**
4. **Conecta tu repositorio:**
   - Selecciona "GitHub"
   - Autoriza Easypanel
   - Selecciona tu repositorio `cofradia`
5. **Configuración automática:**
   - Easypanel detectará el `Dockerfile` automáticamente
   - Puerto: `3000` (ya configurado)
   - Build: Automático con Docker
6. **Variables de entorno (opcional):**
   ```
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_APP_URL=https://tu-dominio.com
   ```
7. **Click en "Deploy"**
8. **¡Listo!** Tu app estará disponible en unos minutos

#### 3. Configurar Dominio (Opcional)

1. En Easypanel, ve a tu aplicación
2. Click en "Domains"
3. Agrega tu dominio personalizado
4. Configura el DNS según las instrucciones

---

### Método B: Subir ZIP

Si prefieres no usar GitHub:

1. **Comprimir el proyecto:**
   ```bash
   # Excluir node_modules y .next
   zip -r cofradia.zip . -x "node_modules/*" ".next/*" ".git/*"
   ```

2. **En Easypanel:**
   - Selecciona "Upload ZIP"
   - Sube `cofradia.zip`
   - Easypanel detectará el Dockerfile
   - Deploy

---

## 🔧 Opción 2: Despliegue con Docker Compose (Desarrollo Local)

### Probar localmente antes de desplegar:

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Acceder a: http://localhost:3000
```

---

## 🐋 Opción 3: Docker Manual

### Construir imagen:

```bash
docker build -t cofradia-crm .
```

### Ejecutar contenedor:

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  --name cofradia-crm \
  cofradia-crm
```

### Ver logs:

```bash
docker logs -f cofradia-crm
```

### Detener:

```bash
docker stop cofradia-crm
docker rm cofradia-crm
```

---

## 🌐 Opción 4: Otros Servicios de Hosting

### Vercel (Más fácil para Next.js)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Railway

1. Conecta tu repositorio de GitHub
2. Railway detectará Next.js automáticamente
3. Deploy

### Render

1. Conecta tu repositorio de GitHub
2. Selecciona "Web Service"
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`

---

## ⚙️ Variables de Entorno

### Para Producción

Crea un archivo `.env.production` (NO lo subas a GitHub):

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
```

### En Easypanel

Configura las variables en la sección "Environment" de tu app:

```
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

---

## 🔍 Verificación Post-Despliegue

### 1. Verifica que la app esté corriendo:

```bash
curl https://tu-dominio.com
```

### 2. Verifica la API:

```bash
# Estadísticas
curl https://tu-dominio.com/api/stats

# Reservas
curl https://tu-dominio.com/api/reservations

# Mesas
curl https://tu-dominio.com/api/tables
```

### 3. Verifica en el navegador:

- Dashboard: `https://tu-dominio.com`
- Reservas: `https://tu-dominio.com/reservations`
- Mesas: `https://tu-dominio.com/tables`
- Ajustes: `https://tu-dominio.com/settings`

---

## 🐛 Solución de Problemas

### Error: "Module not found"

```bash
# Reconstruir imagen
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Error: "Port already in use"

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar 3001 en lugar de 3000
```

### Error: "Build failed"

1. Verifica que `next.config.js` tenga `output: 'standalone'`
2. Verifica que `package.json` tenga todas las dependencias
3. Prueba build local: `npm run build`

### La app no carga estilos

Verifica que en `next.config.js` esté:
```javascript
output: 'standalone'
```

---

## 📊 Monitoreo

### Ver logs en Easypanel:

1. Ve a tu aplicación
2. Click en "Logs"
3. Ver logs en tiempo real

### Ver logs en Docker:

```bash
docker logs -f cofradia-crm
```

---

## 🔄 Actualizar la Aplicación

### Con GitHub (Automático):

```bash
git add .
git commit -m "Actualización"
git push
```

Easypanel desplegará automáticamente si configuraste auto-deploy.

### Manual en Easypanel:

1. Ve a tu aplicación
2. Click en "Redeploy"

---

## 🔐 Seguridad en Producción

### ⚠️ IMPORTANTE antes de producción:

1. **Cambia las credenciales por defecto**
2. **Configura HTTPS** (Easypanel lo hace automático)
3. **Agrega autenticación** para acceso al panel
4. **Configura variables de entorno** sensibles
5. **Habilita backups** automáticos
6. **Configura rate limiting** en la API
7. **Conecta base de datos real** (no usar datos en memoria)

---

## 📈 Próximos Pasos

Después del despliegue:

1. ✅ Configurar dominio personalizado
2. ✅ Configurar SSL/HTTPS (automático en Easypanel)
3. ✅ Conectar base de datos (PostgreSQL recomendado)
4. ✅ Configurar backups automáticos
5. ✅ Agregar autenticación
6. ✅ Configurar emails de notificación
7. ✅ Monitorear logs y errores

---

## 🆘 Soporte

### Recursos útiles:

- **Easypanel Docs:** https://easypanel.io/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Docker Docs:** https://docs.docker.com

### Problemas comunes:

- **Error de build:** Verifica `package.json` y dependencias
- **Puerto ocupado:** Cambia el puerto en configuración
- **Estilos no cargan:** Verifica `output: 'standalone'` en `next.config.js`

---

## ✅ Checklist de Despliegue

Antes de desplegar, verifica:

- [ ] `Dockerfile` creado
- [ ] `.dockerignore` creado
- [ ] `next.config.js` tiene `output: 'standalone'`
- [ ] Código subido a GitHub (si usas GitHub)
- [ ] Variables de entorno configuradas
- [ ] Build local funciona: `npm run build`
- [ ] Docker local funciona: `docker-compose up`

---

**¡Tu aplicación está lista para producción!** 🎉

Para cualquier duda, consulta la documentación de Easypanel o revisa los logs de la aplicación.
