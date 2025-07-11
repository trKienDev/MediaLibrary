import appConfigs from "../../config/app.config";
import { ServerFolders } from "../../constants/folder.constant";
import imageUtils from "../../utils/images.utils.js";
import domsComponent from "../dom.components.js";
import imageComponent from "./image.component";

async function createMangaThumbnail(manga) {
      const mangaWrapper = domsComponent.createDiv('manga-wrapper');
      const mangaAhref = domsComponent.createAhref({
            href: `manga/#id=${manga._id}`,
            cssClass: 'manga-link'
      });

      const mangaSrc = `${appConfigs.SERVER}/${ServerFolders.MANGAS}/${manga.thumbnail}`;
      const mangaThumbnail = imageComponent.createImgElement({ 
            src: mangaSrc,
            cssClass: 'manga-thumbnail'
      });

      mangaAhref.appendChild(mangaThumbnail);
      mangaWrapper.appendChild(mangaAhref);
      imageUtils.addEffectHoverToZoomImage(mangaWrapper, mangaThumbnail);
      return mangaWrapper;
}

const mangaComponent = {
      createMangaThumbnail,
}
export default mangaComponent;