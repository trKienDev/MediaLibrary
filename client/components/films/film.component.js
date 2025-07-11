import appConfigs from "../../config/app.config";
import { formatDate } from "../../utils/date.utils.js";
import imageUtils from "../../utils/images.utils.js";

function renderFilmTemplate(film, folder) {
      const filmDateStr = formatDate(new Date(film.date));
      const thumbnailSrc = `${appConfigs.SERVER}/${folder}/${film.thumbnail}`;
      
      return `
            <artcile class="film-article">
                  <div class="film-article-container>
                        <a href="film/id=${film._id}" class="film-link">
                              <div class="film-thumbnail-wrapper>
                                    <img src="${thumbnailSrc} class="film-thumbnail"/>
                              </div>
                              <div class="film-detail-wrapper>
                                    <div class="film-name">${film.name}</div>
                                    <div class="film-date">${filmDateStr}</div>
                              </div>
                        </a>
                  </div>
            </article
      `;
}

function createFilmThumbnailFrame(film, folder) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = renderFilmTemplate(film, folder);
      const article = wrapper.firstElementChild;

      const thumbnailContainer = article.querySelector('.film-thumbnail-wrapper');
      const thumbnailImage = article.querySelector('.film-thumbnail');

      imageUtils.addEffectHoverToZoomImage(thumbnailContainer, thumbnailImage);
      
      return article;      
}

const filmComponent = {
      createFilmThumbnailFrame,
}
export default filmComponent;