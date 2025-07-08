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

      async function renderPage(pageName, context = 'app') {
            if (!_rootElement) {
                  throw new Error('Bộ render chưa được khởi tạo với phần tử gốc.');
            }

            if (!pageName) {
                  _rootElement.innerHTML = '<h1>Lỗi: Không tìm thấy trang</h1>';
                  return;
            }

            try {
                  const path = `/pages/${context}/${pageName}.html`;
                  console.log(`Đang fetch trang: ${path}`);

                  const response = await fetch(path);
                  if (!response.ok) throw new Error(`Không tìm thấy file trang tại: ${path}`);
                  
                  const html = await response.text();
                  _rootElement.innerHTML = html;

                  // Tạo & gắn thẻ script tường minh
                  const script = document.createElement('script');
                  script.id = 'page-specific-script';
                  script.src = `/pages/${context}/${pageName}.js`;
                  script.type = 'module';

                  document.body.appendChild(script);
            } catch (error) {
                  _rootElement.innerHTML = '<h1>404 - Không tìm thấy trang</h1>';
                  throw new Error(`Lỗi render trang:', ${error}`);
            }
      }

      return {
            init,
            renderPage
      };
})();