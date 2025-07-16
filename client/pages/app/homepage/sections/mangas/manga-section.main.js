import apiService from "../../../../../api/api.instance.js";
import apiEndpoint from "../../../../../api/endpoint.api.js";
import { createMangaThumbnail } from "../../../../../components/images/manga.component.js";

let currentPage = 1;
const limit = 12;
let isLoading = false;
let hasMoreMangas = true;
let observer = null; 

export default async function() {
      try {
            const initialFilters = {};
            const activeFilters = initialFilters;
            currentPage = 1;
            isLoading = false;
            hasMoreMangas = true;

            const container = document.getElementById('mangas-pagination');
            if(container) container.innerHTML = '';

            const loader = document.getElementById('manga-loader');
            if(!loader) {
                  console.error('Ko tìm thấy phần tử #film-loader');
                  return;
            }
            loader.style.display = 'block';
            loader.innerHTML = '<div class="spinner"></div>';

            if(observer) observer.disconnect();
            observer = new IntersectionObserver((entries) => {
                  const firstEntry = entries[0];
                  if(firstEntry.isIntersecting && !isLoading && hasMoreMangas) {
                        console.log("Đã cuộn đến cuối trang, đang tải thêm");
                        loadMoreMangas('mangas-pagination', activeFilters);
                  }
            }, {
                  root: null,
                  threshold: 0.1
            });

            observer.observe(loader);
            console.log('Đang tải loạt films đầu tiên....');
            loadMoreMangas('films-pagination', activeFilters);
      } catch(error) {
            console.error("Error in rendering manga pagination: ", error);
            throw new Error(error);
      }
}

async function loadMoreMangas(elementId, filters = {}) {
      if(isLoading || !hasMoreMangas) return;
      isLoading = true;
      const loader = document.getElementById('manga-loader');
      if(loader) loader.style.display = 'block';

      try {
            const result = await apiService.getPagination({ 
                  apiEndpoint: apiEndpoint.mangas.getRandomizePagination,
                  page: currentPage,
                  limit: limit,
                  filters: filters
            });
            const { mangas, pagination } = result;
            if(mangas && mangas.length > 0) {
                  const mangaThumbnails = await Promise.all(mangas.map( 
                        async manga => createMangaThumbnail(manga)
                  ));
                  const container = document.getElementById('mangas-pagination');
                  mangaThumbnails.forEach(manga => container.appendChild(manga));

                  currentPage++;
                  const totalLoad = pagination.page * pagination.limit;
                  if(totalLoad >= pagination.total) {
                        hasMoreMangas = false;
                        if(loader) loader.innerHTML = 'Bạn đã xem hết films';
                        if(observer) observer.disconnect();
                  }
            } else {
                  hasMoreMangas = false;
                  if(loader) loader.innerHTML = 'Bạn đã xem hết films';
                  if(observer) observer.disconnect();
            }
      } catch(error) {
            console.error('Error getting mangas: ', error);
      } finally {
            isLoading = false;
      }
} 