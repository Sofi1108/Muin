# 📋 Intranet - Guía de Personalización

## 🎯 Resumen de Implementación

La intranet está completamente implementada con protección de roles, estructura profesional y respuesta en todos los dispositivos.

---

## 🔧 Personalización Rápida

### 1. **Cambiar URL del Video**

**Archivo:** `Muin/frontend/src/components/IntranetHome.tsx`  
**Línea:** 14

```typescript
// Cambiar esta línea:
const VIDEO_URL = "https://www.youtube.com/embed/placeholder";

// Por tu enlace real, ej:
const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";
```

### 2. **Actualizar Horario desde API**

**Archivo:** `Muin/frontend/src/components/IntranetHome.tsx`  
**Línea:** 18-30

Reemplaza `scheduleData` con una llamada a tu API:

```typescript
const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);

useEffect(() => {
  fetch("http://localhost:3000/api/schedule")
    .then(res => res.json())
    .then(data => setScheduleData(data));
}, []);
```

### 3. **Actualizar Vacaciones desde API**

**Archivo:** `Muin/frontend/src/components/IntranetHome.tsx`  
**Línea:** 32-36

```typescript
const [holidaysData, setHolidaysData] = useState([]);

useEffect(() => {
  fetch("http://localhost:3000/api/holidays")
    .then(res => res.json())
    .then(data => setHolidaysData(data));
}, []);
```

---

## 📱 Estructura de la Página

```
┌─────────────────────────────────────┐
│  Header (reutilizado)               │
├─────────────────────────────────────┤
│  Welcome, username                  │
├─────────────────────────────────────┤
│  [Video iFrame]                     │
├─────────────────────────────────────┤
│  Weekly Schedule (filtrado por rol) │
│  ┌────────────────────────────────┐ │
│  │ Time │ Activity │ Role (Admin) │ │
│  ├────────────────────────────────┤ │
│  │ ... horarios según rol ...      │ │
│  └────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Calendario    │    Próximas Vacaciones
│ [Cal Grid]    │    • Holiday 1
│               │    • Holiday 2
│               │    • Holiday 3
└─────────────────────────────────────┘
  Footer (reutilizado)
```

---

## 🔐 Control de Acceso

### Roles Permitidos
- `admin` → Acceso ✅
- `employee` → Acceso ✅
- Otros roles → Redirige a `/`
- Sin autenticación → Redirige a `/login`

### Lo que ve cada rol

| Elemento | Admin | Employee |
|----------|:-----:|:--------:|
| Página | ✅ | ✅ |
| Video | ✅ | ✅ |
| Todas actividades | ✅ | ❌ |
| Solo actividades employee | ❌ | ✅ |
| Columna "Role" | ✅ | ❌ |
| Calendario | ✅ | ✅ |

---

## 📊 Interfaz de Datos

### ScheduleEntry
```typescript
interface ScheduleEntry {
  time: string;           // "08:00 AM"
  activity: string;       // "Team Standup"
  role: "admin" | "employee";
}
```

### HolidayEntry
```typescript
{
  date: string;          // "2026-05-25"
  name: string;          // "Holiday 1"
  description: string;   // "Holiday description"
}
```

---

## 🎨 Estilos Personalizables

**Archivo:** `Muin/frontend/src/styles/intranet-home.css`

### Colores Clave
- Azul primario: `#2563eb` (Encabezados, bordes)
- Texto: `#1a1a1a` (Principal), `#666` (Secundario)
- Admin badge: `#fee2e2` fondo, `#991b1b` texto
- Employee badge: `#dbeafe` fondo, `#0c2d6b` texto

### Variables a ajustar
- Ancho máximo: `.intranet-content { max-width: 1200px; }`
- Espaciado: `.intranet-content { padding: 2rem; }`
- Colores: Busca por clase CSS y modifica según necesites

---

## 🚀 Rutas Disponibles

- `GET /intranet` → Intranet (protegida: admin, employee)
- `GET /intranet` sin roles → Redirige a `/`

---

## 📝 Notas Importantes

1. **Footer**: Se reutiliza automáticamente de `App.tsx`
2. **Header**: Se reutiliza automáticamente de `App.tsx`
3. **PrivateRoute**: Valida automáticamente los roles
4. **Datos**: Los datos están hardcodeados para pruebas. Conéctalos a tu API cuando esté lista

---

## ✅ Checklist de Implementación

- ✅ Componente IntranetHome creado
- ✅ Estilos CSS agregados
- ✅ Ruta protegida en App.tsx
- ✅ Filtrado de horario por rol
- ✅ Calendario funcional
- ✅ Responsive en móvil, tablet, desktop
- ✅ Sin errores de compilación

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Página no carga | Verifica que tengas rol `admin` o `employee` |
| Video no aparece | Actualiza VIDEO_URL con URL válida |
| Tabla vacía | Verifica que `scheduleData` tenga elementos |
| Estilos no aplican | Verifica que `intranet-home.css` esté en `styles/` |

