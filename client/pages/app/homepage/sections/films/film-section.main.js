import apiService from "../../../../../api/api.instance.js";
import apiEndpoint from "../../../../../api/endpoint.api.js";
import filmComponent from "../../../../../components/films/film.component.js";
import { ServerFolders } from "../../../../../constants/folder.constant.js";

let currentPage = 1;
const limit = 12;
let isLoading = false;
let hasMoreFilms = true;
let observer = null; 

export default async function() {
      try {
            const initialFilters = {};
            const activeFilters = initialFilters;
            currentPage = 1;
            isLoading = false;
            hasMoreFilms = true;

            const container = document.getElementById('films-pagination');
            if(container) container.innerHTML = '';

            const loader = document.getElementById('film-loader');
            if(!loader) {
                  console.error('Ko tìm thấy phần tử #film-loader');
                  return;
            }
            loader.style.display = 'block';
            loader.innerHTML = '<div class="spinner"></div>';

            if(observer) observer.disconnect();
            observer = new IntersectionObserver((entries) => {
                  const firstEntry = entries[0];
                  if(firstEntry.isIntersecting && !isLoading && hasMoreFilms) {
                        console.log("Đã cuộn đến cuối trang, đang tải thêm");
                        loadMoreFilms('films-pagination', activeFilters);
                  }
            }, {
                  root: null,
                  threshold: 0.1
            });

            observer.observe(loader);
            console.log('Đang tải loạt films đầu tiên....');
            loadMoreFilms('films-pagination', activeFilters);
      } catch(error) {
            console.error("Error in film-section.main: ", error);
            throw new Error(error);
      }
}

async function loadMoreFilms(elementId, filters = {}) {
      if(isLoading || !hasMoreFilms) return;
      isLoading = true;
      const loader = document.getElementById('film-loader');
      if(loader) loader.style.display = 'block';

      try {
            const result = await apiService.getPagination({ 
                  apiEndpoint: apiEndpoint.films.getRandomizePagination,
                  page: currentPage,
                  limit: limit,
                  filters: filters
            });
            const { films, pagination } = result;
            if(films && films.length > 0) {
                  const filmThumbnail = await Promise.all(films.map( 
                        async film => filmComponent.createFilmThumbnailFrame(film, ServerFolders.FILMS, { hoverZoomEffect: true }) 
                  ));
                  const container = document.getElementById('films-pagination');
                  filmThumbnail.forEach(thumbnail => container.appendChild(thumbnail));

                  currentPage++;
                  const totalLoad = pagination.page * pagination.limit;
                  if(totalLoad >= pagination.total) {
                        hasMoreFilms = false;
                        if(loader) loader.innerHTML = 'Bạn đã xem hết films';
                        if(observer) observer.disconnect();
                  }
            } else {
                  hasMoreFilms = false;
                  if(loader) loader.innerHTML = 'Bạn đã xem hết films';
                  if(observer) observer.disconnect();
            }
      } catch(error) {
            console.error('Error getting films: ', error);
      } finally {
            isLoading = false;
      }
} 