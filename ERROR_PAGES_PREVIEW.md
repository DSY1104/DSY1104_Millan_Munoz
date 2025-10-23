# Error Pages Visual Preview

## 🎨 404 Not Found Page

### Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│              ┌────────────┐                 │
│              │    404     │  ← Animated     │
│              │  (bounce)  │                 │
│              └────────────┘                 │
│                                             │
│      ¡Oops! Página no encontrada           │
│                                             │
│   La página que buscas no existe o         │
│        ha sido movida.                      │
│                                             │
│   ┌──────────────────────────────┐         │
│   │  Puedes intentar:            │         │
│   │  → Verificar la URL          │         │
│   │  → Volver a la página        │         │
│   │  → Ir a la página principal  │         │
│   │  → Explorar nuestro catálogo │         │
│   └──────────────────────────────┘         │
│                                             │
│   ┌──────┐ ┌──────┐ ┌───────────┐         │
│   │ 🏠   │ │  ←   │ │ 🛍️       │         │
│   │Inicio│ │Volver│ │Productos  │         │
│   └──────┘ └──────┘ └───────────┘         │
│                                             │
│       🔍      📦      🎮                   │
│       (floating icons)                      │
│                                             │
└─────────────────────────────────────────────┘
```

### Color Scheme

- **Background**: Dark gradient (#1a1a1a → #0a0a0a)
- **404 Numbers**: Blue gradient (var(--accent-blue))
- **Text**: White (#fff)
- **Buttons**: Blue primary, Dark secondary
- **Borders**: Subtle white transparent

### Animations

1. **404 Numbers**: Bounce up and down (staggered)
2. **Background**: Pulsing radial gradient
3. **Floating Icons**: Float and rotate
4. **Buttons**: Lift on hover

---

## 🚨 Error Boundary Page

### Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│                ⚠️                          │
│           (shake animation)                 │
│                                             │
│         ¡Algo salió mal!                   │
│                                             │
│      Ha ocurrido un error inesperado.      │
│                                             │
│   ┌──────────────────────────────┐         │
│   │ ▶ Detalles técnicos          │ ← Dev   │
│   │   (click to expand)          │   only  │
│   │                              │         │
│   │   Stack trace here...        │         │
│   └──────────────────────────────┘         │
│                                             │
│   ┌──────────────────────────────┐         │
│   │  ¿Qué puedes hacer?          │         │
│   │  ✓ Recargar la página        │         │
│   │  ✓ Volver a la página        │         │
│   │  ✓ Ir a la página principal  │         │
│   │  ✓ Contactar soporte         │         │
│   └──────────────────────────────┘         │
│                                             │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│   │ 🔄   │ │ 🏠   │ │  ←   │ │ 💬   │    │
│   │Reload│ │Inicio│ │Volver│ │Soporte│   │
│   └──────┘ └──────┘ └──────┘ └──────┘    │
│                                             │
│   Si el problema continúa...               │
│   Hora: 22/10/2025, 14:30:45               │
│                                             │
└─────────────────────────────────────────────┘
```

### Color Scheme

- **Background**: Dark gradient (#2c3e50 → #1a1a1a)
- **Error Icon**: Red (#e74c3c)
- **Text**: White (#fff)
- **Buttons**: Red primary, Dark secondary
- **Borders**: Subtle white transparent

### Animations

1. **Error Icon**: Shake on load
2. **Details**: Expand/collapse transition
3. **Buttons**: Lift and glow on hover

---

## 📱 Mobile View

### 404 Page (Mobile)

```
┌──────────────┐
│              │
│     404      │
│   (smaller)  │
│              │
│   ¡Oops!     │
│  Página no   │
│  encontrada  │
│              │
│ ┌──────────┐ │
│ │Sugerencias│ │
│ │ → ...     │ │
│ └──────────┘ │
│              │
│ ┌──────────┐ │
│ │🏠 Inicio │ │ ← Stacked
│ └──────────┘ │   buttons
│ ┌──────────┐ │
│ │← Volver  │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │🛍️Productos│ │
│ └──────────┘ │
│              │
│  🔍 📦 🎮   │
│              │
└──────────────┘
```

---

## 🎬 Animation Timeline

### 404 Page Load

```
0ms   → Background fade in
100ms → 404 numbers appear
200ms → Start bouncing animation
400ms → Title fade in
600ms → Message fade in
800ms → Suggestions box slide in
1000ms→ Buttons fade in
1200ms→ Icons start floating
```

### Error Boundary Load

```
0ms   → Background fade in
100ms → Error icon appear + shake
500ms → Title fade in
700ms → Message fade in
900ms → Info box slide in
1100ms→ Buttons fade in
```

---

## 🎯 User Interactions

### 404 Page Buttons

1. **🏠 Ir al Inicio**
   - Action: `navigate("/")`
   - Effect: Smooth navigation to home
2. **← Volver Atrás**
   - Action: `navigate(-1)`
   - Effect: Browser back navigation
3. **🛍️ Ver Productos**
   - Action: `navigate("/products")`
   - Effect: Navigate to catalog

### Error Boundary Buttons

1. **🔄 Recargar Página**
   - Action: `window.location.reload()`
   - Effect: Full page reload
2. **🏠 Ir al Inicio**
   - Action: `navigate("/")`
   - Effect: Navigate to home
3. **← Volver Atrás**
   - Action: `navigate(-1)`
   - Effect: Browser back
4. **💬 Contactar Soporte**
   - Action: `navigate("/support")`
   - Effect: Navigate to support page

---

## 🎨 CSS Effects

### Gradient Examples

```css
/* 404 Numbers */
background: linear-gradient(
  135deg,
  var(--accent-blue),
  var(--accent-blue-tint)
);

/* Error Icon */
color: #e74c3c;
filter: drop-shadow(0 4px 8px rgba(231, 76, 60, 0.3));

/* Glass Morphism */
backdrop-filter: blur(10px);
background: rgba(26, 26, 26, 0.9);
```

### Hover Effects

```css
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(41, 128, 185, 0.3);
}
```

---

## 📐 Responsive Breakpoints

### Desktop (> 768px)

- Large 404 numbers (8rem)
- Multi-column button layout
- Full-size animations

### Tablet (768px)

- Medium 404 numbers (5rem)
- Flexible button layout
- Reduced animations

### Mobile (< 480px)

- Small 404 numbers (4rem)
- Stacked buttons (full width)
- Minimal animations
- Compact spacing

---

## ✨ Special Features

### Development Mode

```javascript
// Stack trace only visible in dev
{
  import.meta.env.DEV && (
    <details className="error-details">
      <summary>Detalles técnicos</summary>
      <pre>{errorStack}</pre>
    </details>
  );
}
```

### Error Detection

```javascript
// Smart error type detection
if (error.status === 404) {
  // Show 404 specific message
} else if (error instanceof Error) {
  // Show JavaScript error message
}
```

### Accessibility

- Semantic HTML (`<main>`, `<section>`)
- ARIA labels on buttons
- Keyboard navigation support
- High contrast colors
- Readable font sizes

---

**Note**: This is a visual representation. See the actual pages at:

- 404: `http://localhost:5175/invalid-url`
- Error: Trigger with test code
