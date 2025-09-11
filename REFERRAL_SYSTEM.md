# Sistema de Códigos de Referido - LevelUp

## Descripción
El sistema de códigos de referido permite a los usuarios obtener puntos LevelUp al registrarse usando un código válido proporcionado por otro usuario.

## Características Implementadas

### ✅ Campo Opcional de Código de Referido
- Campo "Código de referido (opcional)" en el formulario de registro
- Ubicado después del campo de contraseña
- Placeholder descriptivo: "Ej: ABC123"
- Máximo 10 caracteres

### ✅ Validación de Formato
- **Formato requerido**: 6-10 caracteres alfanuméricos (A-Z, a-z, 0-9)
- **Validación en tiempo real**: Se ejecuta mientras el usuario escribe
- **Feedback visual**: Mensajes de error y éxito instantáneos

### ✅ Validación de Existencia (Mock)
Los códigos que comienzan con los siguientes prefijos son considerados válidos:
- `LEVEL*`: 500 puntos para el nuevo usuario
- `GAME*`: 400 puntos para el nuevo usuario  
- `DUOC*`: 600 puntos para el nuevo usuario
- `REF*`: 300 puntos para el nuevo usuario

### ✅ Asignación de Puntos
- **Puntos para el nuevo usuario**: Se asignan automáticamente al registro exitoso
- **Almacenamiento**: Los puntos se guardan en `localStorage` bajo la clave `userPoints`
- **Historial**: Se mantiene un registro de transacciones de referidos en `referralTransactions`

### ✅ Feedback Visual
- **Error**: Mensaje rojo cuando el formato es inválido
- **Éxito**: Mensaje verde cuando el código es válido
- **Notificación**: Alert con puntos ganados después del registro exitoso

## Estructura de Datos

### localStorage Keys:
- `userPoints`: Número total de puntos del usuario
- `referralTransactions`: Array de transacciones de referidos
- `userRegistration`: Datos del usuario registrado (incluye `referralPoints` y `usedReferralCode`)

### Estructura de Transacción de Referido:
```javascript
{
  type: 'referral_bonus',
  points: 500,
  referralCode: 'LEVEL123',
  date: '2025-09-10T15:30:00.000Z',
  userId: '1725984600000'
}
```

## Archivos Modificados

1. **`components/register.html`**
   - Añadido campo de código de referido
   - Añadidos elementos de feedback visual

2. **`assets/js/components/register.js`**
   - Añadidas funciones de validación
   - Lógica de asignación de puntos
   - Event listeners para feedback en tiempo real
   - Actualización del mensaje de éxito

3. **`assets/css/components/_modal.css`**
   - Añadido estilo `.form-hint.success` para feedback positivo

4. **`test-referral-system.html`** (nuevo)
   - Página de prueba con códigos válidos de ejemplo
   - Interfaz para verificar puntos y limpiar datos

## Casos de Uso

### Registro sin Código
```javascript
// Usuario se registra sin código de referido
// resultado: registro normal, 0 puntos de referido
```

### Registro con Código Válido
```javascript
// Usuario ingresa "LEVEL123"
// resultado: 500 puntos LevelUp asignados automáticamente
```

### Código con Formato Inválido
```javascript
// Usuario ingresa "ABC" (muy corto)
// resultado: mensaje de error, no se permite enviar formulario
```

## Pruebas

### Para probar el sistema:
1. Abrir `test-referral-system.html` en el navegador
2. Hacer clic en "Probar Registro con Código de Referido"
3. Llenar el formulario con datos válidos
4. Probar códigos como: `LEVEL123`, `GAME456`, `DUOC789`, `REF001`
5. Observar la validación en tiempo real
6. Completar el registro y verificar los puntos asignados

### Códigos de Prueba Válidos:
- `LEVEL123` → 500 puntos
- `GAME456` → 400 puntos
- `DUOC789` → 600 puntos
- `REF001` → 300 puntos
- `REFERIDO` → 300 puntos (cualquier código que empiece con REF)

## Notas de Implementación

- La validación de existencia de códigos es simulada (mock)
- En producción, se debería validar contra una base de datos real
- Los puntos del referidor no se implementan en esta versión (requiere sistema de usuarios completo)
- El sistema es compatible con la funcionalidad existente de descuentos DUOC
