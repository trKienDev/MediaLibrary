import appConfigs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folder.constant.js";
import { addHoverToScaleEffect } from "../../utils/effects.utils.js";
import domsComponent from "../dom.components.js";
import { createImgElement } from "./image.component.js";

export async function createMangaThumbnail(manga) {
      const mangaWrapper = domsComponent.createDiv({cssClass: 'manga-wrapper'});
      const mangaAhref = domsComponent.createAhref({
            href: `manga/${manga._id}`,
            cssClass: 'manga-link',
            attrs: {
                  'data-spa': 'true',
            }
      });

      const mangaSrc = `${appConfigs.SERVER}/${ServerFolders.MANGAS}/${manga.thumbnail}`;
      const mangaThumbnail = createImgElement({ 
            src: mangaSrc,
            cssClass: 'manga-thumbnail'
      });

      mangaAhref.appendChild(mangaThumbnail);
      mangaWrapper.appendChild(mangaAhref);
      addHoverToScaleEffect(mangaWrapper);
      return mangaWrapper;
}
