import { renderAnimeFilms, renderAnimeVideos, renderClipsSection, renderCreatorsSection, renderFilmsSection, renderIdolsSection, renderImagesSection, renderMangasSection, renderShortsSection, renderVideosSection } from "./section.renderers.js";

const sectionRegistry = {
      creators: renderCreatorsSection,
      videos: renderVideosSection,
      films: renderFilmsSection,
      mangas: renderMangasSection,
      anime_videos: renderAnimeVideos,
      anime_films: renderAnimeFilms,
      idols: renderIdolsSection,
      images: renderImagesSection,
      shorts: renderShortsSection,
      clips: renderClipsSection,
}
export default sectionRegistry;