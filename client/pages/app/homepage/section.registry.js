import { renderAnimeFilmsSection, renderAnimeVideosSection, renderClipsSection, renderCreatorsSection, renderFilmsSection, renderIdolsSection, renderImagesSection, renderMangasSection, renderShortsSection, renderVideosSection } from "./section.renderers.js";

const sectionRegistry = {
      creators: renderCreatorsSection,
      videos: renderVideosSection,
      films: renderFilmsSection,
      mangas: renderMangasSection,
      anime_videos: renderAnimeVideosSection,
      anime_films: renderAnimeFilmsSection,
      idols: renderIdolsSection,
      images: renderImagesSection,
      shorts: renderShortsSection,
      clips: renderClipsSection,
}
export default sectionRegistry;