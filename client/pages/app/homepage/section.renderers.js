import domsComponent from "../../../components/dom.components.js";
import filmComponent from "../../../components/films/film.component.js";
import { createMangaThumbnail } from "../../../components/images/manga.component.js";
import { ServerFolders } from "../../../constants/folder.constant.js";
import VideoArticle from "../../../components/videos/video-article/video-article.class.js";
import AnimeVideoArticle from "../../../components/videos/video-article/anime-video-article.class.js";
import AvatarComponent, { AvatarTypes } from "../../../components/images/avatar.component.js";
import imageFrameComponent from "../../../components/images/image-frame.component.js";
import ShortVideoArticle from "../../../components/videos/video-article/short-video-article.class.js";
import ClipVideoArticle from "../../../components/videos/video-article/clip-video-article.class.js";

export async function renderSection(data, {
      wrapperClass,
      itemFactory
}) {
      const container = domsComponent.createDiv('section-content-container');
      const wrapper = domsComponent.createDiv(wrapperClass);
      const items = await Promise.all(data.map(itemFactory));
      wrapper.append(...items);
      container.appendChild(wrapper);
      return container;
}


// ---- Specialized renderers ----
export async function renderCreatorsSection(data) {
      const avatarComponent = AvatarComponent();
      return renderSection(data, {
            wrapperClass: 'avatars-wrapper',
            itemFactory: async creator => avatarComponent.create(creator._id, AvatarTypes.CREATOR)
      });
}
export async function renderIdolsSection(data) {
      const avatarComponent = AvatarComponent();
      return renderSection(data, {
            wrapperClass: 'avatars-wrapper',
            itemFactory: async idol => avatarComponent.create(idol._id, AvatarTypes.IDOL)
      });
}

export async function renderVideosSection(data) {
      return renderSection(data, {
            wrapperClass: 'videos-wrapper',
            itemFactory: async video => {
                  const instance = new VideoArticle(video);
                  return instance.render();
            }
      })
}
export async function renderAnimeVideosSection(data) {
      return renderSection(data, {
            wrapperClass: 'videos-wrapper',
            itemFactory: async video => {
                  const instance = new AnimeVideoArticle(video);
                  return instance.render();
            }
      });
}

export async function renderFilmsSection(data) {
      return renderSection(data, {
            wrapperClass: 'films-wrapper',
            itemFactory: async film => filmComponent.createFilmThumbnailFrame(film, ServerFolders.FILMS)
      });
}
export async function renderAnimeFilmsSection(data) {
      return renderSection(data, {
            wrapperClass: 'films-wrapper',
            itemFactory: async film => filmComponent.createFilmThumbnailFrame(film, ServerFolders.ANIME_FILMS)
      });
}

export async function renderMangasSection(data) {
      return renderSection(data, {
            wrapperClass: 'films-wrapper',
            itemFactory: async manga => createMangaThumbnail(manga)
      });
}

export async function renderImagesSection(data) {
      return renderSection(data, {
            wrapperClass: 'images-wrapper',
            itemFactory: async image => imageFrameComponent.createImageFrame(image)
      });
}

export async function renderShortsSection(data) {
      return renderSection(data, {
            wrapperClass: 'shorts-wrapper',
            itemFactory: async video => {
                  const instance = new ShortVideoArticle(video);
                  return instance.render();
            }
      });
}

export async function renderClipsSection(data) {
      return renderSection(data, {
            wrapperClass: 'videos-wrapper',
            itemFactory: async video => {
                  const instance = new ClipVideoArticle(video);
                  return instance.render();
            }
      });
}



// export async function renderCreatorsSection(data) {
//       const container = domsComponent.createDiv('section-content-container');
//       const wrapper = domsComponent.createDiv('avatars-wrapper');
//       const avatarComponent = AvatarComponent(); // khởi tạo factory trước
//       const frames = await Promise.all(data.map(async creator => await avatarComponent.create(creator._id, AvatarTypes.CREATOR)));
//       wrapper.append(...frames);
//       container.appendChild(wrapper);
//       return container;
// }
// export async function renderVideosSection(data) {
//       const container = domsComponent.createDiv('section-content-container');
//       const wrapper = domsComponent.createDiv('videos-wrapper');
//      //  const articles = await Promise.all(data.map(videoComponent.createVideoArticle)); ==> cần sửa
//      // giữ lại instanc để destroy() sau này
//      const articlePromises = data.map(async video => {
//             const instance = new VideoArticle(video);
//             return await instance.render();
//       });
//       const videoArticles = await Promise.all(articlePromises);
//       wrapper.append(...videoArticles);
//       container.appendChild(wrapper);
//       return container;
// }
// export async function renderFilmsSection(data) {
//       const container = domsComponent.createDiv('section-content-container');
//       const wrapper = domsComponent.createDiv('films-wrapper');
//       const frames = await Promise.all(data.map(film => filmComponent.createFilmThumbnailFrame(film, ServerFolders.FILMS)));
//       wrapper.append(...frames);
//       container.appendChild(wrapper);
//       return container;
// }
// export async function renderMangasSection(data) {
//       const container = domsComponent.createDiv('section-content-container');
//       const wrapper = domsComponent.createDiv('films-wrapper');
//       const frames = await Promise.all(data.map(createMangaThumbnail));
//       wrapper.append(...frames);
//       container.appendChild(wrapper);
//       return container;
// }
// export async function renderAnimeVideos(data) {
//       const container = domsComponent.createDiv('section-content-container');
//       const wrapper = domsComponent.createDiv('videos-wrapper');
//      //  const articles = await Promise.all(data.map(videoComponent.createVideoArticle)); ==> cần sửa
//      // giữ lại instanc để destroy() sau này
//      const articlePromises = data.map(async video => {
//             const instance = new AnimeVideoArticle(video);
//             return await instance.render();
//       });
//       const videoArticles = await Promise.all(articlePromises);
//       wrapper.append(...videoArticles);
//       container.appendChild(wrapper);
//       return container;
// }
// export async function renderAnimeFilms(data) {
//       const container = domsComponent.createDiv('section-content-container');
//       const wrapper = domsComponent.createDiv('films-wrapper');
//       const frames = await Promise.all(data.map(film => filmComponent.createFilmThumbnailFrame(film, ServerFolders.ANIME_FILMS)));
//       wrapper.append(...frames);
//       container.appendChild(wrapper);
//       return container;
// }
// export async function renderIdolsSection(data) {
//       console.log('run renderIdolsSection');
//       const container = domsComponent.createDiv('section-content-container');
//       const wrapper = domsComponent.createDiv('avatars-wrapper');
//       const avatarComponent = AvatarComponent(); // khởi tạo factory trước
//       const frames = await Promise.all(data.map(async idol => await avatarComponent.create(idol._id, AvatarTypes.IDOL)));
//       wrapper.append(...frames);
//       container.appendChild(wrapper);
//       return container;
// }
// export async function renderImagesSection(data) {
//       const container = domsComponent.createDiv('section-content-container');
//       const wrapper = domsComponent.createDiv('images-wrapper');
//       const frames = await Promise.all(data.map(image => imageFrameComponent.createImageFrame(image)));
//       wrapper.append(...frames);
//       container.appendChild(wrapper);
//       return container;
// }
// export async function renderShortsSection(data) {
//       const container = domsComponent.createDiv('section-content-container');
//       const wrapper = domsComponent.createDiv('shorts-wrapper');
//      //  const articles = await Promise.all(data.map(videoComponent.createVideoArticle)); ==> cần sửa
//      // giữ lại instanc để destroy() sau này
//      const articlePromises = data.map(async video => {
//             const instance = new ShortVideoArticle(video);
//             return await instance.render();
//       });
//       const shortArticles = await Promise.all(articlePromises);
//       wrapper.append(...shortArticles);
//       container.appendChild(wrapper);
//       return container;
// }
// export async function renderClipsSection(data) {
//       const container = domsComponent.createDiv('section-content-container');
//       const wrapper = domsComponent.createDiv('videos-wrapper');
//      //  const articles = await Promise.all(data.map(videoComponent.createVideoArticle)); ==> cần sửa
//      // giữ lại instanc để destroy() sau này
//      const articlePromises = data.map(async video => {
//             const instance = new ClipVideoArticle(video);
//             return await instance.render();
//       });
//       const clipArticles = await Promise.all(articlePromises);
//       wrapper.append(...clipArticles);
//       container.appendChild(wrapper);
//       return container;
// }
