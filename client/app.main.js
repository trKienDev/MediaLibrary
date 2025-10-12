import './services/state.service.js';
import './spa/render.spa.js';
import './spa/router.spa.js';
import './components/images/image-lightbox.component.js';
import './components/videos/video-lightbox.component.js';
import ToastNotifier from './utils/toast-notification/toast-notification.utils.js';

window.App = window.App || {};
App.pages =  App.pages || { app: {}, admin: {} }; // Khởi tạo namespace cho pages

const appRoutes = [
      { path: '/', page: 'homepage/home.main' },
      // pages
      { path: '/film/:id', page: 'film/film.main' },
      { path: '/video/:id', page: 'video/video.main' },
      { path: '/anime-video/:id', page: 'anime-video/anime-video.main' },
      { path: '/anime-film/:id', page: 'anime-film/anime-film.main' },
      { path: '/creator/:id', page: 'creator/creator.main' },
      { path: '/idol/:id', page: 'idol/idol.main' },
      { path: '/clip/:id', page: 'clip/clip.main' },
      // sections
      { path: '/section/videos', page: 'homepage/sections/video/video-section.main'},
      { path: '/section/films', page: 'homepage/sections/films/film-section.main'},
      { path: '/section/animes', page: 'homepage/sections/animes/anime-section.main' },
      { path: '/section/mangas', page: 'homepage/sections/mangas/manga-section.main' },
      { path: '/section/images', page: 'homepage/sections/images/image-section.main' },
      { path: '/section/shorts', page: 'homepage/sections/shorts/short-section.main' },
      { path: '/section/studios', page: 'homepage/sections/studios/studio-section.main' },
      { path: '/section/creators', page: 'homepage/sections/creators/creator-section.main' },
      { path: '/section/records', page: 'homepage/sections/records/record-section.main' }
];

function AppController() {
      App.spa.router.init({
            routes: appRoutes,
            context: 'app',
            rootElementId: 'app-root-content',
      });
}
AppController();
export const toastNotifier = new ToastNotifier();