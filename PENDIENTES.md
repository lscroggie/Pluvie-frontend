# Pendientes

## Sesión por cookie httpOnly y protección por rol en el servidor

Estado: **propuesto, no implementado.** Hoy la sesión es un mock en `localStorage`
(`src/lib/auth/session.ts`) y la protección de rutas es solo de cliente (`RoleGate`).

Plan resumido (patrón BFF, Next 16):

1. Variable de servidor `PLUVIE_API_URL` (sin `NEXT_PUBLIC`) y `.env.example`.
2. Cookie `pluvie_session` con el JWT del backend tal cual: `httpOnly`, `secure` en
   producción, `sameSite: lax`, `maxAge` tomado del `exp`.
3. Acciones de servidor de login y logout. Login llama al backend Go desde el servidor;
   ante 401 o 429 muestra un mensaje genérico.
4. `src/proxy.ts` (reemplazo de `middleware` en Next 16): sin cookie válida en `/perfil`,
   `/turno`, `/staff` o `/gerencial` redirige a `/login`; con el rol equivocado, al portal
   propio. Es un chequeo optimista, no la autorización real. La regla va en una función
   pura con tests en vitest.
5. Revalidar la sesión contra el backend en el layout de cada portal.
6. Limpieza: eliminar el `localStorage` de sesión, `RoleGate` y `useAuthRole`; adaptar
   `LoginFlow` y `ProfileDrawer` a las acciones.

Límites: Next no puede verificar la firma sin el `JWT_SECRET` (HS256), y no se recomienda
compartirlo. El backend no tiene logout: cerrar sesión borra la cookie, pero el token sigue
válido hasta su vencimiento (24 h).

### Preguntas abiertas

- [ ] **Login.** ¿Se reemplaza el flujo DNI + código + biometría (hoy mock) por email y
      contraseña, que es lo único que acepta el backend? ¿O el backend va a sumar DNI y OTP?
- [ ] **`GET /api/v1/auth/me`.** ¿Se agrega en el backend (solo `RequireAuth`, devuelve el
      perfil) para validar la sesión del lado servidor? Es un cambio en el repo de Go. Sin
      él, la primera fase solo hace un chequeo optimista: decodifica el payload sin verificar
      la firma.
- [ ] **Gerencial en `/staff`.** El backend deja al rol `managerial` usar los endpoints de
      staff. ¿Puede entrar también a `/staff`, o se mantiene el rol exacto como hoy?
- [ ] **Datos de prueba.** ¿Hay una base local con usuarios de los tres roles, o hay que
      preparar un script? El registro público solo crea donantes; staff y gerencial se
      insertan a mano.

### Lo que se verificó del backend (leyendo su código; no había una instancia corriendo)

- `POST /api/v1/auth/login` con `{email, password}` responde JSON
  `{token, profile: {id, email, full_name, role}}`. No hay `Set-Cookie` en ningún lado; las
  rutas protegidas piden `Authorization: Bearer <token>`.
- Claims del JWT: `user_id`, `role` (`donor`, `staff` o `managerial`), `iss: pluvie`,
  `aud: pluvie-api`, `sub`, `iat`, `nbf`, `exp` a 24 h. Firma HS256 con `JWT_SECRET`
  compartido. Sin refresh ni logout. La sede no viaja en el token.
- Los nombres de rol difieren del frontend y hace falta un mapeo: `donor` → `donante`,
  `managerial` → `gerencial`, `staff` → `staff`.
- El rol se valida en cada endpoint. `RequireAuth` re-consulta la base (rol distinto o
  cuenta desactivada → 401) y `RequireRole` decide por grupo de rutas: donante
  (`POST /appointments`, `GET /appointments/mine`), staff y gerencial (agenda, check-in,
  completar) y solo gerencial (desactivar, reactivar y borrar usuarios). Los tests de
  middleware y handler del backend pasan.
- No existe un endpoint `GET` de sesión ni endpoints de dashboard: el portal gerencial del
  frontend es 100% mock.
- CORS: `ALLOWED_ORIGINS` viene vacío por defecto. No afecta si Next llama al backend desde
  el servidor.
