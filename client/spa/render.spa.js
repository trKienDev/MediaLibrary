window.App = window.App || {};
App.spa = App.spa || {};

App.spa.render = (function() {
      let _rootElement = null;

      function init(rootElementId) {
            _rootElement = document.getElementById(rootElementId);
            if (!_rootElement) {
                  throw new Error(`Không tìm thấy phần tử gốc:', ${rootElementId}`);
            }
      }

      async function renderPage(pageName, context = 'app', params= {}) {
            if (!_rootElement) {
                  throw new Error('Bộ render chưa được khởi tạo với phần tử gốc.');
            }

            if (!pageName) {
                  _rootElement.innerHTML = '<h1>Lỗi: Không tìm thấy trang</h1>';
                  return;
            }

            try {
                  const path = `/pages/${context}/${pageName}.html`;
                  console.log(`Fetching page: ${path}`);
                  const response = await fetch(path);
                  if (!response.ok) throw new Error(`Không tìm thấy file trang tại: ${path}`);
                  
                  const html = await response.text();
                  _rootElement.innerHTML = html;

                  // // Gắn params toàn cục cho page script để sử dụng
                  window.PageParams = params;

                  const modulePath = `/pages/${context}/${pageName}.js?t=${Date.now()}`;
                  const module = await import(modulePath);
                  if(module && typeof module.default === 'function') {
                        await module.default();
                  } else {
                        console.warn(`Module ${modulePath} does not export default function`);
                  }
            } catch (error) {
                  if(_rootElement) {
                        _rootElement.innerHTML = '<h1>404 - Không tìm thấy trang</h1>';
                  }
                  throw new Error(`Lỗi render trang:', ${error}`);
            }
      }

      return {
            init,
            renderPage
      };
})();