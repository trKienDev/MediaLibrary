import apiService from "../../../../../api/api.instance.js";
import apiEndpoint from "../../../../../api/endpoint.api.js";
import ClipVideoArticle from "../../../../../components/videos/video-article/clip-video-article.class.js";

let currentPage = 1;
const limit = 12;
let isLoading = false;
let hasMoreClip = true;
let observer = null; 

export default async function () {
      const initialFilters = {};
      const activeFilters = initialFilters;
      currentPage = 1;
      isLoading = false;
      hasMoreClip = true;

      const container = document.getElementById('records-pagination');
      if(container) container.innerHTML = '';

      const loader = document.getElementById('record-loader');
      if(!loader) {
            console.error('Ko tìm thấy phần tử #record-loader');
            return;
      }
      loader.style.display = 'block';
      loader.innerHTML = '<div class="spinner"></div>';

      // clean up observer cũ (nếu có)
      if(observer) observer.disconnect();

      observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];
            if(firstEntry.isIntersecting && !isLoading && hasMoreClip) {
                  console.log("Đã cuộn đến cuối trang, đang tải thêm");
                  loadMoreRecords('records-pagination', activeFilters);
            }
      }, {
            root: null,
            threshold: 0.1
      });

      observer.observe(loader);
      console.log('Đang tải loạt clip đầu tiên....');
      console.log('active filters: ', activeFilters);
      loadMoreRecords('records-pagination', activeFilters);
}

async function loadMoreRecords(elementId, filters = {}) {
      if(isLoading || !hasMoreClip) return;
      isLoading = true;
      const loader = document.getElementById('record-loader');
      if(loader) loader.style.display = 'block';

      try {
            const result = await apiService.getPagination({ 
                  apiEndpoint: apiEndpoint.clips.getUniquePagination,
                  page: currentPage,
                  limit: limit,
                  filters: filters
            });
            const { clips, pagination } = result;

            if(clips && clips.length > 0) {
                  const clipArticles = await Promise.all(clips.map( async clip => {
                        const instance = new ClipVideoArticle(clip);
                        return instance.render();
                  }));
                  const container = document.getElementById('records-pagination');
                  clipArticles.forEach(article => container.appendChild(article));

                  currentPage++;
                  const totalLoad = pagination.page * pagination.limit;
                  if(totalLoad >= pagination.total) {
                        hasMoreClip = false;
                        if(loader) loader.innerHTML = 'Bạn đã xem hết clip';
                        if(observer) observer.disconnect();
                  }
            } else {
                  hasMoreClip = false;
                  if(loader) loader.innerHTML = 'Bạn đã xem hết clip';
                  if(observer) observer.disconnect();
            }
      } catch(error) {
            console.error('Error getting clips: ', error);
      } finally {
            isLoading = false;
      }
} 