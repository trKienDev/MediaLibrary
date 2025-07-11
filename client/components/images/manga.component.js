import appConfigs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folder.constant.js";
import { addHoverToScaleEffect } from "../../utils/effects.utils.js";
import imageUtils from "../../utils/images.utils.js";
import domsComponent from "../dom.components.js";
import imageComponent from "./image.component.js";

export async function createMangaThumbnail(manga) {
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
      addHoverToScaleEffect(mangaWrapper);
      return mangaWrapper;
}
