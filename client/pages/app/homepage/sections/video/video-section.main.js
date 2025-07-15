import apiService from "../../../../../api/api.instance.js";
import apiEndpoint from "../../../../../api/endpoint.api.js";
import VideoArticle from "../../../../../components/videos/video-article/video-article.class.js";

let currentPage = 1;
const limit = 12;
let isLoading = false;
let hasMoreVideo = true;
let observer = null; 

export default async function() {
      console.log('Initialize infinite scroll');
      const initialFilters = {};
      const activeFilters = initialFilters;
      currentPage = 1;
      isLoading = false;
      hasMoreVideo = true;

      const container = document.getElementById('videos-pagination');
      if(container) container.innerHTML = '';

      const loader = document.getElementById('video-loader');
      if(!loader) {
            console.error('Ko tìm thấy phần tử #video-loader');
            return;
      }
      loader.style.display = 'block';
      loader.innerHTML = '<div class="spinner"></div>';

      // clean up observer cũ (nếu có)
      if(observer) observer.disconnect();

      observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];
            if(firstEntry.isIntersecting && !isLoading && hasMoreVideo) {
                  console.log("Đã cuộn đến cuối trang, đang tải thêm");
                  loadMoreVideos('videos-pagination', activeFilters);
            }
      }, {
            root: null,
            threshold: 0.1
      });

      observer.observe(loader);
      console.log('Đang tải loạt video đầu tiên....');
      console.log('active filters: ', activeFilters);
      loadMoreVideos('videos-pagination', activeFilters);
}

async function loadMoreVideos(elementId, filters = {}) {
      if(isLoading || !hasMoreVideo) return;
      isLoading = true;
      const loader = document.getElementById('video-loader');
      if(loader) loader.style.display = 'block';

      try {
            const result = await apiService.getPagination({ 
                  apiEndpoint: apiEndpoint.videos.getUniquePagination,
                  page: currentPage,
                  limit: limit,
                  filters: filters
            });
            const { videos, pagination } = result;

            if(videos && videos.length > 0) {
                  const videoArticles = await Promise.all(videos.map( async video => {
                        const instance = new VideoArticle(video);
                        return instance.render();
                  }));
                  const container = document.getElementById('videos-pagination');
                  videoArticles.forEach(article => container.appendChild(article));

                  currentPage++;
                  const totalLoad = pagination.page * pagination.limit;
                  if(totalLoad >= pagination.total) {
                        hasMoreVideo = false;
                        if(loader) loader.innerHTML = 'Bạn đã xem hết video';
                        if(observer) observer.disconnect();
                  }
            } else {
                  hasMoreVideo = false;
                  if(loader) loader.innerHTML = 'Bạn đã xem hết video';
                  if(observer) observer.disconnect();
            }
      } catch(error) {
            console.error('Error getting videos: ', error);
      } finally {
            isLoading = false;
      }
} 