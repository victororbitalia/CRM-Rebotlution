# ⚡ Inicio Rápido - Despliegue en Easypanel

## 🎯 Opción Más Rápida: GitHub + Easypanel

### 1️⃣ Sube a GitHub (2 minutos)

```bash
git init
git add .
git commit -m "Listo para Easypanel"
git remote add origin https://github.com/TU-USUARIO/cofradia-crm.git
git branch -M main
git push -u origin main
```

### 2️⃣ Despliega en Easypanel (3 minutos)

1. **Accede a Easypanel**
2. **Create** > **App**
3. **Conecta GitHub** > Selecciona tu repo
4. **Deploy** ✅

**¡Listo!** Tu app estará en: `https://tu-app.easypanel.host`

---

## 📦 Alternativa: Subir ZIP

```bash
# Crear ZIP (excluye node_modules)
zip -r cofradia.zip . -x "node_modules/*" ".next/*" ".git/*"
```

En Easypanel:
1. **Create** > **App**
2. **Upload** > Sube `cofradia.zip`
3. **Deploy** ✅

---

## 🔧 Configuración Mínima

En Easypanel, configura:

**Variables de entorno:**
```
NODE_ENV=production
PORT=3000
```

**Recursos:**
- CPU: 0.5-1
- RAM: 512MB-1GB

---

## ✅ Verificación

Después del despliegue, verifica:

- ✅ `https://tu-dominio.com` - Dashboard
- ✅ `https://tu-dominio.com/api/stats` - API funciona
- ✅ `https://tu-dominio.com/settings` - Configuración

---

## 📚 Documentación Completa

- **Guía detallada:** [EASYPANEL_SETUP.md](./EASYPANEL_SETUP.md)
- **Todas las opciones:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Documentación API:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🆘 Problemas?

### Build falla
```bash
# Verifica build local
npm run build
```

### App no inicia
- Revisa logs en Easypanel
- Verifica puerto: 3000
- Verifica variables de entorno

### No carga estilos
- Verifica que `next.config.js` tenga: `output: 'standalone'`

---

**¡Tu CRM está listo en menos de 5 minutos!** 🎉
