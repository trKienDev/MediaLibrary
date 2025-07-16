import apiService from "../../../../../api/api.instance.js";
import apiEndpoint from "../../../../../api/endpoint.api.js";
import ShortVideoArticle from "../../../../../components/videos/video-article/short-video-article.class.js";

let currentPage = 1;
const limit = 12;
let isLoading = false;
let hasMoreShorts = true;
let observer = null; 

export default async function() {
      try {
            const initialFilters = {};
            const activeFilters = initialFilters;
            currentPage = 1;
            isLoading = false;
            hasMoreShorts = true;

            const container = document.getElementById('shorts-pagination');
            if(container) container.innerHTML = '';

            const loader = document.getElementById('short-loader');
            if(!loader) {
                  console.error('Ko tìm thấy phần tử #short-loader');
                  return;
            }
            loader.style.display = 'block';
            loader.innerHTML = '<div class="spinner"></div>';

            if(observer) observer.disconnect();
            observer = new IntersectionObserver((entries) => {
                  const firstEntry = entries[0];
                  if(firstEntry.isIntersecting && !isLoading && hasMoreShorts) {
                        console.log("Đã cuộn đến cuối trang, đang tải thêm");
                        loadMoreShorts('shorts-pagination', activeFilters);
                  }
            }, {
                  root: null,
                  threshold: 0.1
            });

            observer.observe(loader);
            console.log('Đang tải loạt films đầu tiên....');
            loadMoreShorts('images-pagination', activeFilters);
      } catch(error) {
            console.error("Error in getting images pagination ", error);
            throw new Error(error);
      }
}

async function loadMoreShorts(elementId, filters = {}) {
      if(isLoading || !hasMoreShorts) return;
      isLoading = true;
      const loader = document.getElementById('short-loader');
      if(loader) loader.style.display = 'block';

      try {
            const result = await apiService.getPagination({ 
                  apiEndpoint: apiEndpoint.shorts.getRandomPagination,
                  page: currentPage,
                  limit: limit,
                  filters: filters
            });
            const { shorts, pagination } = result;
            if(shorts && shorts.length > 0) {
                  const shortArticles = await Promise.all(shorts.map( 
                        async short => {
                              const instance = new ShortVideoArticle(short);
                              return instance.render();
                        }
                  ));
                  const container = document.getElementById('shorts-pagination');
                  shortArticles.forEach( article => container.appendChild(article));

                  currentPage++;
                  const totalLoad = pagination.page * pagination.limit;
                  if(totalLoad >= pagination.total) {
                        hasMoreShorts = false;
                        if(loader) loader.innerHTML = 'Bạn đã xem hết shorts';
                        if(observer) observer.disconnect();
                  }
            } else {
                  hasMoreShorts = false;
                  if(loader) loader.innerHTML = 'Bạn đã xem hết films';
                  if(observer) observer.disconnect();
            }
      } catch(error) {
            console.error('Error getting shorts: ', error);
      } finally {
            isLoading = false;
      }
} 