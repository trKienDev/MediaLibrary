import apiService from "../../../../../api/api.instance.js";
import apiEndpoint from "../../../../../api/endpoint.api.js";
import AnimeVideoArticle from "../../../../../components/videos/video-article/anime-video-article.class.js";
import VideoArticle from "../../../../../components/videos/video-article/video-article.class.js";

let currentPage = 1;
const limit = 12;
let isLoading = false;
let hasMoreVideos = true;
let observer = null; 

export default async function() {
      try {
            const initialFilters = {};
            const activeFilters = initialFilters;
            currentPage = 1;
            isLoading = false;
            hasMoreVideos = true;

            const container = document.getElementById('animes-pagination');
            if(container) container.innerHTML = '';

            const loader = document.getElementById('animes-loader');
            if(!loader) {
                  console.error('Ko tìm thấy phần tử #animes-loader');
                  return;
            }
            loader.style.display = 'block';
            loader.innerHTML = '<div class="spinner"></div>'

            if(observer) observer.discconnect();

            observer = new IntersectionObserver((entries) => {
                  const firstEntry = entries[0];
                  if(firstEntry.isIntersecting && !isLoading && hasMoreVideos) {
                        console.log("Đã cuộn đến cuối trang, đang tải thêm");
                        loadMoreAnimes('animes-pagination', activeFilters);
                  }
            }, {
                  root: null,
                  threshold: 0.1
            });

            observer.observe(loader);
            loadMoreAnimes('animes-pagination', activeFilters);
      } catch(error) {
            console.error('Error in anime section: ', error);
      }
}

async function loadMoreAnimes(filters = {}) {
      if(isLoading || !hasMoreVideos) return;
      isLoading = true;
      const loader = document.getElementById('animes-loader');
      if(loader) loader.style.display = 'block';

      try {
            const result = await apiService.getPagination({
                  apiEndpoint: apiEndpoint.anime_videos.getUniquePagination,
                  page: currentPage,
                  limit: limit,
                  filters: filters
            });
            console.log('result: ', result);
            const { videos, pagination } = result;

            if(videos && videos.length > 0) {
                  const videoArticles = await Promise.all(videos.map(async video => {
                        const instance = new AnimeVideoArticle(video);
                        return instance.render();
                  }));
                  const container = document.getElementById('animes-pagination');
                  videoArticles.forEach(article => container.appendChild(article));

                  currentPage++;
                  const totalLoad = pagination.page * pagination.limit;
                  if(totalLoad >= pagination.total) {
                        hasMoreVideos = false;
                        if(loader) loader.innerHTML = 'Bạn đã xem hết video';
                        if(observer) observer.disconnect();
                  }
            } else {
                  hasMoreVideos = false;
                  if(loader) loader.innerHTML = 'Bạn đã xem hết video';
                  if(observer) observer.discconnect();
            }
      } catch(error) {
            console.error('Error getting animes: ', error);
      } finally {
            isLoading = false;
      }
}