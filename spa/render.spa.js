window.App = window.App || {};
App.spa = App.spa || {};

App.spa.render = (function() {
      // THAY ĐỔI: Chuyển root ra ngoài để router có thể truyền vào nếu cần
      let _rootElement = null;

      function init(rootElementId) {
            _rootElement = document.getElementById(rootElementId);
            if (!_rootElement) {
                  throw new Error(`Không tìm thấy phần tử gốc:', ${rootElementId}`);
            }
      }

      // THAY ĐỔI: Thêm tham số `context`
      async function renderPage(pageName, context = 'app') {
        if (!_rootElement) {
            throw new Error('Bộ render chưa được khởi tạo với phần tử gốc.');
        }

        if (!pageName) {
            _rootElement.innerHTML = '<h1>Lỗi: Không tìm thấy trang</h1>';
            return;
        }

        try {
            // THAY ĐỔI: Xây dựng đường dẫn động dựa trên context
            const path = `/pages/${context}/${pageName}.html`;
            console.log(`Đang fetch trang: ${path}`);

            const response = await fetch(path);
            if (!response.ok) throw new Error(`Không tìm thấy file trang tại: ${path}`);
            
            const html = await response.text();
            _rootElement.innerHTML = html;
            
            // THAY ĐỔI: Gọi hàm mount của trang dựa trên context
            if (App.pages && App.pages[context] && typeof App.pages[context][pageName] === 'function') {
                App.pages[context][pageName]();
            }

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