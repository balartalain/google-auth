(function () {
  const STYLES = `
    .gauth-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px;
      border: 1.5px solid #dadce0;
      border-radius: 999px;
      background: #fff;
      font-family: 'Google Sans', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #3c4043;
      cursor: pointer;
      transition: box-shadow .2s, background .2s;
      user-select: none;
    }
    .gauth-btn:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15); background: #f8f9fa; }
    .gauth-btn:active { background: #f1f3f4; }
    .gauth-btn img { width: 18px; height: 18px; }
  `;

  const style = document.createElement('style');
  style.textContent = STYLES;
  document.head.appendChild(style);

  // renderGoogleButton(containerId, callback, authPageUrl)
  // El callback se llama cuando el usuario regresa con el token en la URL
  // authPageUrl: URL donde está desplegado auth_page.html

  window.renderGoogleButton = function (containerId, callback, authPageUrl) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`renderGoogleButton: no se encontró el elemento #${containerId}`);
      return;
    }

    // Si venimos de vuelta de auth_page con ?token=... en la URL, ejecutar callback
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    if (token) {
      // Limpiar token de la URL sin recargar la página
      const cleanUrl = window.location.pathname;
      history.replaceState(null, '', cleanUrl);

      // Llamar al callback con el token y los datos del usuario
      callback(token, {
        name:    params.get('name'),
        email:   params.get('email'),
        picture: params.get('picture'),
      });
      return;
    }

    // Renderizar el botón
    const btn = document.createElement('button');
    btn.className = 'gauth-btn';
    btn.innerHTML = `
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
      Iniciar sesión con Google
    `;

    btn.addEventListener('click', function () {
      // Redirigir a auth_page pasando la URL actual como redirect_uri
      const redirectUri = window.location.href;
      const url = new URL(authPageUrl);
      url.searchParams.set('redirect_uri', redirectUri);
      window.location.href = url.toString();
    });

    container.appendChild(btn);
  };
})();