import { createMangaThumbnail } from "../../../components/images/manga.component.js";
import { renderCreatorsSection, renderFilmsSection, renderMangasSection, renderVideosSection } from "./section.renderers.js";

const sectionRegistry = {
      creators: renderCreatorsSection,
      videos: renderVideosSection,
      films: renderFilmsSection,
      mangas: renderMangasSection,
      /// .........................
}
export default sectionRegistry;