// film.component.js

import appConfigs from "../../config/app.config.js";
import { formatDate } from "../../utils/date.utils.js";
import { addHoverToScaleEffect } from "../../utils/effects.utils.js";
import { addEffectHoverToZoomImage } from "../../utils/images.utils.js";
import domsComponent from "../dom.components.js";
import { createImgElement } from "../images/image.component.js";

function createFilmLink(film, prefix = 'film') {
      return domsComponent.createAhref({
            href: `/${prefix}/${film._id}`,
            cssClass: 'film-link',
            attrs: { 'data-spa': 'true' }
      });
}

function createFilmThumbnail(film, folder) {
      const wrapper = domsComponent.createDiv({ cssClass: 'film-thumbnail-wrapper' });
      const imgSrc = `${appConfigs.SERVER}/${folder}/${film.thumbnail}`;
      const image = createImgElement({ src: imgSrc, cssClass: 'film-thumbnail' });
      wrapper.appendChild(image);
      return { wrapper, image };
}

function createFilmInfor(film) {
      const wrapper = domsComponent.createDiv({ cssClass: 'film-infor-wrapper' });
      const nameDiv = domsComponent.createDiv({ cssClass: 'film-name' });
      nameDiv.textContent = film.name;

      const dateStr = formatDate(new Date(film.date));
      const dateDiv = domsComponent.createDiv({ cssClass: 'film-date' });
      dateDiv.textContent = dateStr;

      wrapper.appendChild(nameDiv);
      wrapper.appendChild(dateDiv);
      return wrapper;
}

function createFilmArticle(configs = {}) {
      // Mặc định KHÔNG bật hiệu ứng nào
      const {
            hoverScaleEffect, // undefined/false => off
            hoverZoomEffect   // undefined/false => off
      } = configs;

      // Chế độ EXCLUSIVE: nếu zoom=true thì không bật scale
      const enableZoom = hoverZoomEffect === true;
      const enableScale = !enableZoom && hoverScaleEffect === true;

      const article = domsComponent.createArticle({ cssClass: 'film-article' });
      const wrapper = domsComponent.createDiv({ cssClass: 'film-article-wrapper' });
      article.appendChild(wrapper);

      if (enableScale) addHoverToScaleEffect(article);

      // trả về flags để dùng tiếp ở dưới
      return { article, wrapper, enableZoom };
}

function createFilmThumbnailFrame(film, folder, configs = {}) {
      const { prefix } = configs;
      const { article, wrapper, enableZoom } = createFilmArticle(configs);
      const link = createFilmLink(film, prefix);
      const { wrapper: thumbWrapper, image } = createFilmThumbnail(film, folder);
      const infor = createFilmInfor(film);

      link.appendChild(thumbWrapper);
      link.appendChild(infor);
      wrapper.appendChild(link);

      console.log('enableZoom: ', enableZoom);
      if (enableZoom) addEffectHoverToZoomImage(thumbWrapper, image);

      return article;
}

const filmComponent = { createFilmThumbnailFrame };
export default filmComponent;
