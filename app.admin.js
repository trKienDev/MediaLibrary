window.App = window.App || {};
App.pages = App.pages || { app: {}, admin: {} }; // Đảm bảo namespace tồn tại

// Định nghĩa routes cho admin
const adminRoutes = {
    '/admin/': 'dashboard/dashboard.admin', // URL gốc của admin
    '/admin/dashboard': 'dashboard/dashboard.admin',
};

App.initAdmin = function() {
    console.log('Ứng dụng Admin đang khởi tạo...');

    // Khởi chạy router với cấu hình cho 'admin'
    App.spa.router.init({
        routes: adminRoutes,
        context: 'admin',
        rootElementId: 'admin-root'
    });
};