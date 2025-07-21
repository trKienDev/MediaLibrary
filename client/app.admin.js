import './services/state.service.js';
import './spa/render.spa.js';
import './spa/router.spa.js';
import { InitializeActiveStateAsync } from "./utils/active-state.utils.js";
import AlertBox from './utils/alert-box/alert-box.utils.js';
import ToastNotifier from './utils/toast-notification/toast-notification.utils.js';

window.App = window.App || {};
App.pages = App.pages || { app: {}, admin: {} }; // Đảm bảo namespace tồn tại

// Định nghĩa routes cho admin
const adminRoutes = [
      // '/admin/': 'dashboard/dashboard.admin', // URL gốc của admin
      // '/admin/dashboard': 'dashboard/dashboard.admin',\
      { path: '/admin/tag', page: 'tag/tag.admin' },
      { path: '/admin/creator', page: 'creator/creator.admin' },
      { path: '/admin/studio', page: 'studio/studio.admin' },
];

function AdminController() {
      console.log('Ứng dụng Admin đang khởi tạo...');

      // Khởi chạy router với cấu hình cho 'admin'
      App.spa.router.init({
            routes: adminRoutes,
            context: 'admin',
            rootElementId: 'admin-root-content'
      });

      InitializeActiveStateAsync({
            containerSelector: '#admin-sidebar',
            activatableClassName: 'sidebar-tab',
            defaultIndex: 0,
            waitTimeout: 3000
      });
      
};
AdminController();
export const toastNotifier = new ToastNotifier();
export const alertBox = new AlertBox();