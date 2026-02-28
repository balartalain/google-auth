# Google Auth Button

Widget embebible que permite agregar autenticación con Google en cualquier página web con una sola función. Internamente abre un popup que maneja el flujo OAuth de Google y devuelve el `id_token` JWT listo para verificar en tu backend.

---

## Archivos

| Archivo | Descripción |
|---|---|
| `auth-button.js` | Script embebible que expone `renderGoogleButton()` |
| `auth-page.html` | Página intermediaria que ejecuta el OAuth de Google |

Ambos archivos deben estar desplegados en el mismo dominio (ej. Netlify).

---

## Uso

### 1. Incluir el script

Agrega el script en tu página HTML:

```html
<script src="https://tu-sitio.netlify.app/auth-button.js"></script>
```

### 2. Definir el contenedor

Agrega un `div` donde quieres que aparezca el botón:

```html
<div id="login-btn"></div>
```

### 3. Llamar a `renderGoogleButton`

```html
<script>
  renderGoogleButton(
    'login-btn',                                          // id del contenedor
    function(token, user) {                               // callback
      console.log(user.email);
      // enviar token al backend para verificar
      fetch('/api/auth/google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
      });
    },
    'https://tu-sitio.netlify.app/auth-page.html'        // url de auth-page
  );
</script>
```

---

## API

### `renderGoogleButton(containerId, callback, authPageUrl)`

| Parámetro | Tipo | Descripción |
|---|---|---|
| `containerId` | `string` | ID del elemento donde se renderiza el botón |
| `callback` | `function(token, user)` | Función que se ejecuta al autenticarse |
| `authPageUrl` | `string` | URL donde está desplegado `auth-page.html` |

### Objeto `user` recibido en el callback

```json
{
  "name":    "Juan Pérez",
  "email":   "juan@gmail.com",
  "picture": "https://lh3.googleusercontent.com/...",
  "sub":     "1234567890"
}
```

### `token`

JWT firmado por Google. Úsalo en tu backend para verificar la identidad del usuario. **No confíes en los datos del `user` sin verificar el token en el servidor.**

---

## Verificación en el backend (Django)

```python
from google.oauth2 import id_token
from google.auth.transport import requests

GOOGLE_CLIENT_ID = 'TU_CLIENT_ID.apps.googleusercontent.com'

def google_login(request):
    token = request.data.get('token')
    idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

    email      = idinfo['email']
    first_name = idinfo.get('given_name', '')
    last_name  = idinfo.get('family_name', '')
```

---

## Cómo funciona internamente

```
Tu página             auth-page.html (popup)         Google
    |                        |                           |
  click botón ─────── abre popup (400x500)              |
    |                  renderButton de Google ──────────>|
    |                        |                  selector de cuenta
    |                        |<────── id_token JWT ──────|
    |                  BroadcastChannel ──────────────── |
    |<── callback(token, user) ──────                    |
    |                  window.close()                    |
  fetch backend                                          |
```

El popup nunca navega fuera de `auth-page.html`, por lo que `BroadcastChannel` funciona correctamente entre las ventanas del mismo origen.

---

## Requisitos

- `auth-page.html` debe estar en **HTTPS**
- El dominio de `auth-page.html` debe estar registrado en **Google Cloud Console** como _Authorized JavaScript origin_
- El navegador del usuario debe soportar `BroadcastChannel` (todos los navegadores modernos)
