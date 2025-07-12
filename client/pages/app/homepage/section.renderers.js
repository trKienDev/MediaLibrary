import domsComponent from "../../../components/dom.components.js";
import filmComponent from "../../../components/films/film.component";
import mangaComponent from "../../../components/images/manga.component.js";
import VideoArticle from "../../../components/videos/video-article/video-article.component.js";

async function renderVideosSection(data) {
      const container = domsComponent.createDiv('section-content-container');
      const wrapper = domsComponent.createDiv('section-wrapper');
     //  const articles = await Promise.all(data.map(videoComponent.createVideoArticle)); ==> cần sửa
     // giữ lại instanc để destroy() sau này
     const articlePromises = data.map(async video => {
            const instance = new VideoArticle(video);
            return await instance.render();
      });
      const videoArticles = await Promise.all(articlePromises);
      wrapper.append(...videoArticles);
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