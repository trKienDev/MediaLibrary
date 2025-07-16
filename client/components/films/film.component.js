import appConfigs from "../../config/app.config.js";
import { formatDate } from "../../utils/date.utils.js";
import { addHoverToScaleEffect } from "../../utils/effects.utils.js";
import domsComponent from "../dom.components.js";
import { createImgElement } from "../images/image.component.js";

// factory: create <a> link element
function createFilmLink(film) {
      return domsComponent.createAhref({
            href: `film/${film._id}`,
            cssClass: 'film-link',
            attrs: {
                  'data-spa': 'true'
            }
      });
}

// factory: create thumbnail container + image
function createFilmThumbnail(film, folder) {
      const wrapper = domsComponent.createDiv({cssClass: 'film-thumbnail-wrapper'});
      const imgSrc = `${appConfigs.SERVER}/${folder}/${film.thumbnail}`;
      const image = createImgElement({ src: imgSrc, cssClass: 'film-thumbnail' });
      wrapper.appendChild(image);

      return wrapper;
}

// factory: create infor wrapper (name + date)
function createFilmInfor(film) {
      const wrapper = domsComponent.createDiv({cssClass: 'film-infor-wrapper'});
      const nameDiv = domsComponent.createDiv({cssClass: 'film-name'});
      nameDiv.textContent = film.name;

      const dateStr = formatDate(new Date(film.date));
      const dateDiv = domsComponent.createDiv({cssClass: 'film-date'});
      dateDiv.textContent = dateStr;

      wrapper.appendChild(nameDiv);
      wrapper.appendChild(dateDiv);
      return wrapper;
}

// factory: create main article frame
function createFilmArticle() {
      const article = domsComponent.createArticle({cssClass: 'film-article'});
      const wrapper = domsComponent.createDiv({ cssClass: 'film-article-wrapper' });
      article.appendChild(wrapper);
      addHoverToScaleEffect(article);
      
      return { article, wrapper };
}

// Main function: compose everything
function createFilmThumbnailFrame(film, folder) {
      const { article, wrapper } = createFilmArticle();
      const link = createFilmLink(film);
      const thumbnail = createFilmThumbnail(film, folder);
      const infor = createFilmInfor(film);

      link.appendChild(thumbnail);
      link.appendChild(infor);
      wrapper.appendChild(link);

      return article;
}

const filmComponent = {
      createFilmThumbnailFrame,
}
export default filmComponent;
