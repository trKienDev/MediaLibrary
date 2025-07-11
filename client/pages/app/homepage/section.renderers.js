import domsComponent from "../../../components/dom.components.js";
import filmComponent from "../../../components/films/film.component.js";
import avatarComponent from "../../../components/images/avatar.component.js";
import { createMangaThumbnail } from "../../../components/images/manga.component.js";
import videoComponent from "../../../components/videos/video.component.js";
import { ServerFolders } from "../../../constants/folder.constant.js";

export async function renderCreatorsSection(data) {
      const container = domsComponent.createDiv('section-content-container');
      const wrapper = domsComponent.createDiv('section-wrapper');
      const frames = await Promise.all(data.map(avatarComponent.createAvatar));
      wrapper.append(...frames);
      container.appendChild(wrapper);
      return container;
}
export async function renderVideosSection(data) {
      const container = domsComponent.createDiv('section-content-container');
      const wrapper = domsComponent.createDiv('section-wrapper');
      const articles = await Promise.all(data.map(videoComponent.createVideoArticle));
      wrapper.append(...articles);
      container.appendChild(wrapper);
      return container;
}
export async function renderFilmsSection(data) {
      const container = domsComponent.createDiv('section-content-container');
      const wrapper = domsComponent.createDiv('section-wrapper');
      const frames = await Promise.all(data.map(film => filmComponent.createFilmThumbnailFrame(film, ServerFolders.FILMS)));
      wrapper.append(...frames);
      container.appendChild(wrapper);
      return container;
}
export async function renderMangasSection(data) {
      const container = domsComponent.createDiv('section-content-container');
      const wrapper = domsComponent.createDiv('section-wrapper');
      const frames = await Promise.all(data.map(createMangaThumbnail));
      wrapper.append(...frames);
      container.appendChild(wrapper);
      return container;
}
