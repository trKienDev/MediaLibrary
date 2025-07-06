import './services/state.service.js';
import './spa/render.spa.js';
import './spa/router.spa.js';
import activeStateUtils from "./utils/active-state.utils.js";

window.App = window.App || {};
App.pages = App.pages || { app: {}, admin: {} }; // Đảm bảo namespace tồn tại

// Định nghĩa routes cho admin
const adminRoutes = {
      '/admin/': 'dashboard/dashboard.admin', // URL gốc của admin
      '/admin/dashboard': 'dashboard/dashboard.admin',
      '/admin/creator': 'creator/creator.admin',
      '/admin/studio': 'studio/studio.admin',
      '/admin/film': 'film/film.admin',
      '/admin/collection': 'collection/collection.admin',
      '/admin/video': 'video/video.admin',
      '/admin/playlist': 'playlist/playlist.admin',
      '/admin/code': 'code/code.admin',
      '/admin/tag': 'tag/tag.admin',
      'admin/anime': 'anime/anime.admin',
      'admin/manga': 'manga/manga.admin',
      'admin/idol': 'idol/idol.admin',
      'admin/image': 'image/image.admin',
      'admin/short': 'short/short.admin',
      'admin/record': 'record/record.admin',
};

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