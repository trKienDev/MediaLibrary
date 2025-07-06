window.App = window.App || {};
App.spa = App.spa || {};

App.spa.router = (function() {
      const { renderPage } = App.spa.render;

      let _routes = {};
      let _context = 'app';

      function handleLocation() {
            console.log('run handleLocation');
            const path = window.location.pathname;
            const pageName = _routes[path] || '404'; 
            renderPage(pageName, _context);
      }

      function navigate(event) {
            // Chỉ xử lý nếu click vào link SPA
            if (!event.target.matches('a[data-spa]')) {
                  return;
            }
            event.preventDefault();
            const href = event.target.getAttribute('href');
            // Chỉ điều hướng nếu URL thay đổi để tránh render lại không cần thiết
            if (window.location.pathname !== href) {
                  window.history.pushState({}, '', href);
                  handleLocation();
            }
      }

      function init({ routes, context, rootElementId }) {
            _routes = routes;
            _context = context || 'app';

            // Khởi tạo bộ render với đúng phần tử gốc
            App.spa.render.init(rootElementId);

            document.addEventListener('click', navigate);
            window.addEventListener('popstate', handleLocation);
      }

      return {
            init,
            handleLocation,
      };
})();