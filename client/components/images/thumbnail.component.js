import apiService from "../../api/api.instance.js";
import apiEndpoint from "../../api/endpoint.api.js";
import appConfigs from "../../config/app.config.js";

export async function uploadThumbnail({ thumbnailImageId, thumbnailUploadElid, submitBtnId }) {
      const thumbnailImageEl = document.getElementById(thumbnailImageId);
      const thumbnailUploadEl = document.getElementById(thumbnailUploadElid);
      
      // Setup sự kiện click 1 lần duy nhất
      if(!thumbnailImageEl.dataset.listenerAdded) {
            thumbnailImageEl.addEventListener('click', () => {
                  thumbnailUploadEl.click();
            });
      }
      thumbnailImageEl.dataset.listenerAdded = 'true';

      while(true) {
            const result = await _waitForUploadOrSubmit(thumbnailUploadElid, thumbnailImageId);
            if(result.type === 'upload') {
                  document.getElementById('thumbnail-image').src = URL.createObjectURL(result.file);
            } else if (result.type === 'submit') {
                  break;
            }
      }
}

function _waitForUploadOrSubmit(thumbnailUploadId, submitBtnId) {
      return new Promise((resolve) => {
            const thumbnailUploadEl = document.getElementById(thumbnailUploadId);
            const submitBtnEl = document.getElementById(submitBtnId);

            const onUpload = () => {
                  if(thumbnailUploadEl.files.length > 0) {
                        const file = thumbnailUploadEl.files[0];
                        cleanup();
                        resolve({ type: 'upload', file });
                  }
            };

            const onSubmit = () => {
                  cleanup();
                  resolve({ type: 'submit' });
            };

            function cleanup() {
                  thumbnailUploadEl.removeEventListener('change', onUpload);
                  submitBtnEl.removeEventListener('click', onSubmit);
            }

            thumbnailUploadEl.addEventListener('change', onUpload);
            submitBtnEl.addEventListener('click', onSubmit);
      });
}

export async function updateFilmThumbnailSource({ filmId, thumbnailElId, uploadPath }) {
      const [ filmThumbnail, filmName] = await Promise.all([
            apiService.getName(apiEndpoint.films.getById, filmId),
            apiService.getThumbnail(apiEndpoint.films.getById, filmId)
      ]);
      const filmThumbnailEl = document.getElementById(thumbnailElId);
      filmThumbnailEl.src = `${appConfigs.SERVER}/${uploadPath}/${filmThumbnail}`;
      filmThumbnailEl.alt = `${filmName} thumbnail`;
}

