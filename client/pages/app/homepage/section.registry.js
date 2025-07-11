import sectionRenderers from "./section.renderers.js";

const sectionRegistry = {
      videos: sectionRenderers.renderVideosSection,
      films: sectionRenderers.renderFilmsSection,
      mangas: sectionRenderers.renderMangasSection,
      /// .........................
}
export default sectionRegistry;