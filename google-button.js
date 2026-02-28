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
  
    window.renderGoogleButton = function (containerId, callback, authPageUrl='https://tudominio.com/auth-page.html') {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`renderGoogleButton: no se encontró el elemento #${containerId}`);
        return;
      }
  
      const btn = document.createElement('button');
      btn.className = 'gauth-btn';
      btn.innerHTML = `
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
        Iniciar sesión con Google
      `;
  
      btn.addEventListener('click', function () {
        const w = 400, h = 500;
        window.open(
           authPageUrl,
          'googleAuth',
          `width=${w},height=${h},top=${(screen.height-h)/2},left=${(screen.width-w)/2},resizable=no`
        );
  
        const channel = new BroadcastChannel('google_oauth');
        channel.onmessage = function ({ data }) {
          channel.close();
          if (data.type === 'GOOGLE_AUTH_SUCCESS') {
            callback(data.token, data.user);
          }
        };
      });
  
      container.appendChild(btn);
    };
  })();