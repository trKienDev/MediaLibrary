(function() {
      const SCRIPTS = [
            // Services
            '/services/state.service.js',
            // SPA Core
            '/spa/render.spa.js',
            '/spa/router.spa.js',
            // Page-specific logic
            '/pages/app/homepage/home.page.js',
            // Main App Initializer (tải cuối cùng)
            '/app.js'
      ];

      function loadScript(src) {
            return new Promise((resolve, reject) => {
                  const script = document.createElement('script');
                  script.src = src;
                  script.onload = resolve;
                  script.onerror = reject;
                  document.head.appendChild(script);
            });
      }

      async function initialize() {
            for (const src of SCRIPTS) {
                  await loadScript(src);
            }
            // Gọi hàm init toàn cục sau khi tất cả script đã tải
            if (window.App && typeof window.App.init === 'function') {
                  window.App.init();
            }
      }

      initialize();
})();