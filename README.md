# UAPA Google Auth

Librería embebible que permite agregar autenticación con Google en cualquier página web con una sola función. Maneja el flujo OAuth completo mediante redirect y devuelve un `id_token` JWT listo para verificar en el backend.

---

## Archivos

| Archivo | Descripción |
|---|---|
| `google-auth.js` | Script embebible que expone `signInWithGoogle()` |
| `auth_page.html` | Página intermediaria que ejecuta el OAuth de Google |

Ambos están desplegados en [https://uapa-auth.netlify.app](https://uapa-auth.netlify.app).

---

## Flujo

```
Tu app → llama signInWithGoogle()
       → redirect a auth_page.html?redirect_uri=...
         → usuario hace click en botón de Google
         → selecciona su cuenta
         → token obtenido
       → redirect de vuelta a tu app?token=XXX&email=...
Tu app → signInWithGoogle() detecta el token en la URL
       → ejecuta el callback(token, user)
       → limpia la URL automáticamente
```

---

## Uso

### 1. Incluir el script

```html
<script src="https://uapa-auth.netlify.app/google-auth.js"></script>
```

### 2. Llamar a `signInWithGoogle()`

```html
<script>
  signInWithGoogle({
    callback: function(token, user) {
      console.log(user.email);
      // enviar token al backend para verificar
      fetch('/api/auth/google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
      });
    }
  });
</script>
```

---

## API

### `signInWithGoogle(options)`

| Parámetro | Tipo | Requerido | Default | Descripción |
|---|---|---|---|---|
| `callback` | `function(token, user)` | ✅ | — | Se ejecuta al completar la autenticación |
| `authPageUrl` | `string` | ❌ | `https://uapa-auth.netlify.app/auth_page.html` | URL de la página de autenticación |
| `title` | `string` | ❌ | `'Bienvenido a UAPA'` | Título que se muestra en la página de login |
| `subtitle` | `string` | ❌ | `''` | Subtítulo que se muestra en la página de login |

### Objeto `user` recibido en el callback

```json
{
  "name":    "Juan Pérez",
  "email":   "juan@gmail.com",
  "picture": "https://lh3.googleusercontent.com/..."
}
```

### `token`

JWT firmado por Google. Úsalo en tu backend para verificar la identidad del usuario. **No confíes en los datos del objeto `user` sin verificar el token en el servidor.**

---

## Ejemplos

### Mínimo

```javascript
signInWithGoogle({
  callback: function(token, user) {
    console.log('Autenticado:', user.email);
  }
});
```

### Con textos personalizados

```javascript
signInWithGoogle({
  title:    'Bienvenido al Portal Estudiantil',
  subtitle: 'Usa tu cuenta institucional @uapa.edu.do',
  callback: function(token, user) {
    fetch('/api/auth/google/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    }).then(res => res.json()).then(data => {
      window.location.href = '/dashboard';
    });
  }
});
```

### Con URL de auth_page personalizada

```javascript
signInWithGoogle({
  authPageUrl: 'https://mi-dominio.com/auth_page.html',
  title:       'Mi Aplicación',
  callback:    function(token, user) { ... }
});
```

---

## Verificación del token en el backend (Django)

```python
from google.oauth2 import id_token
from google.auth.transport import requests

GOOGLE_CLIENT_ID = 'TU_CLIENT_ID.apps.googleusercontent.com'

def google_login(request):
    token = request.data.get('token')
    idinfo = id_token.verify_oauth2_token(
        token, requests.Request(), GOOGLE_CLIENT_ID
    )
    email      = idinfo['email']
    first_name = idinfo.get('given_name', '')
    last_name  = idinfo.get('family_name', '')
```

---

## Requisitos

- El dominio donde uses `google-auth.js` debe estar registrado en **Google Cloud Console** como _Authorized JavaScript origin_
- Navegadores modernos con soporte para `URLSearchParams` y `history.replaceState`
