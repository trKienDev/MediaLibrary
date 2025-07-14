import './services/state.service.js';
import './spa/render.spa.js';
import './spa/router.spa.js';
import activeStateUtils from "./utils/active-state.utils.js";
import ToastNotifier from './utils/toast-notification/toast-notification.utils.js';

window.App = window.App || {};
App.pages = App.pages || { app: {}, admin: {} }; // Đảm bảo namespace tồn tại

// Định nghĩa routes cho admin
const adminRoutes = [
      // '/admin/': 'dashboard/dashboard.admin', // URL gốc của admin
      // '/admin/dashboard': 'dashboard/dashboard.admin',\
      { path: '/admin/tag', page: 'tag/tag.admin' },
];

function AdminController() {
      console.log('Ứng dụng Admin đang khởi tạo...');

      // Khởi chạy router với cấu hình cho 'admin'
      App.spa.router.init({
            routes: adminRoutes,
            context: 'admin',
            rootElementId: 'admin-root-content'
      });

      activeStateUtils.init('#admin-sidebar', 'li');
      
};
AdminController();
export const toastNotifier = new ToastNotifier();