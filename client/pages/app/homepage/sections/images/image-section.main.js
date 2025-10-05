import apiService from "../../../../../api/api.instance.js";
import apiEndpoint from "../../../../../api/endpoint.api.js";
import { createImageFrame } from "../../../../../components/images/image-frame.component.js";

let currentPage = 1;
const limit = 12;
let isLoading = false;
let hasMoreImages = true;
let observer = null; 

export default async function() {
      try {
            const initialFilters = {};
            const activeFilters = initialFilters;
            currentPage = 1;
            isLoading = false;
            hasMoreImages = true;
            const seed = Math.random().toString(36).substring(2);

            const container = document.getElementById('images-pagination');
            if(container) container.innerHTML = '';

            const loader = document.getElementById('image-loader');
            if(!loader) {
                  console.error('Ko tìm thấy phần tử #film-loader');
                  return;
            }
            loader.style.display = 'block';
            loader.innerHTML = '<div class="spinner"></div>';

            if(observer) observer.disconnect();
            observer = new IntersectionObserver((entries) => {
                  const firstEntry = entries[0];
                  if(firstEntry.isIntersecting && !isLoading && hasMoreImages) {
                        console.log("Đã cuộn đến cuối trang, đang tải thêm");
                        loadMoreImages('images-pagination', seed, activeFilters);
                  }
            }, {
                  root: null,
                  threshold: 0.1
            });

            observer.observe(loader);
            console.log('Đang tải loạt films đầu tiên....');
            loadMoreImages('images-pagination', seed, activeFilters);
      } catch(error) {
            console.error("Error in getting images pagination ", error);
            throw new Error(error);
      }
}

async function loadMoreImages(elementId, seed, filters = {}) {
      if(isLoading || !hasMoreImages) return;
      isLoading = true;
      const loader = document.getElementById('image-loader');
      if(loader) loader.style.display = 'block';

      try {
            const result = await apiService.getPagination({ 
                  apiEndpoint: apiEndpoint.images.getRandomPagination,
                  page: currentPage,
                  limit: limit,
                  filters: filters,
                  seed: seed
            });
            const { images, pagination } = result;
            if(images && images.length > 0) {
                  const imageFrames = await Promise.all(images.map( 
                        async image => createImageFrame(image, `/image/${image._id}`)
                  ));
                  const container = document.getElementById('images-pagination');
                  imageFrames.forEach(image => container.appendChild(image));

                  currentPage++;
                  const totalLoad = pagination.page * pagination.limit;
                  if(totalLoad >= pagination.total) {
                        hasMoreImages = false;
                        if(loader) loader.innerHTML = 'Bạn đã xem hết images';
                        if(observer) observer.disconnect();
                  }
            } else {
                  hasMoreImages = false;
                  if(loader) loader.innerHTML = 'Bạn đã xem hết films';
                  if(observer) observer.disconnect();
            }
      } catch(error) {
            console.error('Error getting images: ', error);
      } finally {
            isLoading = false;
      }
} 