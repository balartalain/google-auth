(function () {

  const DEFAULT_AUTH_PAGE = 'https://uapa-auth.netlify.app/auth_page.html';

  // signInWithGoogle({ callback, authPageUrl, title, subtitle })
  //
  // callback   : function(token, user) — se ejecuta al regresar con el token
  // authPageUrl: (opcional) Default: 'https://uapa-auth.netlify.app/auth_page.html'
  // title      : (opcional) título en auth_page. Default: 'Bienvenido a UAPA'
  // subtitle   : (opcional) subtítulo en auth_page. Default: ''

  window.signInWithGoogle = function ({ callback, authPageUrl = DEFAULT_AUTH_PAGE, title, subtitle }) {

    // Si venimos de vuelta de auth_page con ?token=... en la URL
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');

    if (token) {
      // Limpiar parámetros de la URL sin recargar
      history.replaceState(null, '', window.location.pathname);

      callback(token, {
        name:    params.get('name'),
        email:   params.get('email'),
        picture: params.get('picture'),
      });
      return;
    }

    // Redirigir a auth_page
    const url = new URL(authPageUrl);
    url.searchParams.set('redirect_uri', window.location.href);
    if (title)    url.searchParams.set('title',    title);
    if (subtitle) url.searchParams.set('subtitle', subtitle);
    window.location.href = url.toString();
  };

})();