import './services/state.service.js';
import './spa/render.spa.js';
import './spa/router.spa.js';
import ToastNotifier from './utils/toast-notification/toast-notification.utils.js';

window.App = window.App || {};
App.pages =  App.pages || { app: {}, admin: {} }; // Khởi tạo namespace cho pages

// Định nghĩa routes cho người dùng
const appRoutes = {
      '/': 'homepage/home.main',
      '/about': 'about/about.main',
      '/products': 'products/product.main'
};

function AppController() {
      App.spa.router.init({
            routes: appRoutes,
            context: 'app',
            rootElementId: 'app-root-content'
      });
}
AppController();
export const toastNotifier = new ToastNotifier();