window.App = window.App || {};
App.spa = App.spa || {};

App.spa.router = (function() {
      const { renderPage } = App.spa.render;

      let _routes = {};
      let _context = 'app';

      function matchRoute(path) {
            for(const route of _routes) {
                  const paramNames = [];
                  const regexPath = route.path.replace(/:([^/]+)/g, (_, key) => {
                        paramNames.push(key);
                        return '([^/]+)';
                  });
                  const regex = new RegExp(`^${regexPath}$`);
                  const match = path.match(regex);
                  if(match) {
                        const params = {};
                        paramNames.forEach((name, index) => {
                              params[name] = match[index + 1]; 
                        });
                        return { pageName: route.page, params};
                  }
            }
            return null;
      }

      function handleLocation() {
            const path = window.location.pathname;
            console.log('path: ', path);
            const match = matchRoute(path);
            if(match) {
                  renderPage(match.pageName, _context, match.params);
            }
      }

      function navigate(event) {
            // Chỉ xử lý nếu click vào link SPA
            const anchor = event.target.closest('a[data-spa]');
            if (!anchor) return;

            event.preventDefault();
            const href = anchor.getAttribute('href');

            // normalize relative path to absolute
            const url = new URL(href, window.location.origin);
            const path = url.pathname;
            console.log(`navigate(): href=${href}, resolved path=${path}, current path=${window.location.pathname}`);
            console.log(`window.location.pathname: ${window.location.pathname} / path: ${path}`);
            // Chỉ navigate nếu pathname khác:
            if (window.location.pathname !== path) {
                  console.log('pathname: ', window.location.pathname);
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

            // Tải nội dung cho trang ban đầu
            handleLocation();
      }

      return {
            init,
            handleLocation,
      };
})();