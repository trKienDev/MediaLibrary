window.App = window.App || {};
App.pages = { app: {}, admin: {} }; // Khởi tạo namespace cho pages

// Định nghĩa routes cho người dùng
const appRoutes = {
    '/': 'homepage/home.page',
    '/about': 'about/about.page',
    '/products': 'products/product.page'
};

App.init = function() {
    console.log('Ứng dụng chính đang khởi tạo...');
    
    // Khởi chạy router với cấu hình cho 'app'
    App.spa.router.init({ routes: appRoutes, context: 'app', rootElementId: 'app-root' });

      App.spa.router.handleLocation();
};