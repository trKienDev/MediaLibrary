import domsComponent from "../../../components/dom.components.js";
import filmComponent from "../../../components/films/film.component";
import mangaComponent from "../../../components/images/manga.component.js";
import videoComponent from "../../../components/videos/video.component.js";

async function renderVideosSection(data) {
      const container = domsComponent.createDiv('section-content-container');
      const wrapper = domsComponent.createDiv('section-wrapper');
      const articles = await Promise.all(data.map(videoComponent.createVideoArticle));
      wrapper.append(...articles);
      container.appendChild(wrapper);
      return container;
}
async function renderFilmsSection(data) {
      const container = domsComponent.createDiv('section-content-container');
      const wrapper = domsComponent.createDiv('section-wrapper');
      const frames = await Promise.all(data.map(film => filmComponent.createFilmThumbnailFrame));
      wrapper.append(...frames);
      container.appendChild(wrapper);
      return container;
}
async function renderMangasSection(data) {
      const container = domsComponent.createDiv('section-content-container');
      const wrapper = domsComponent.createDiv('section-wrapper');
      const frames = await Promise.all(data.map(mangaComponent.createMangaThumbnail));
      wrapper.append(...frames);
      container.appendChild(wrapper);
      return container;
}

const sectionRenderers = {
      renderVideosSection,
      renderFilmsSection,
      renderMangasSection,
}
export default sectionRenderers;