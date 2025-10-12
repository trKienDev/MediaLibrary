import appConfigs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folder.constant.js";
import { addHoverToScaleEffect } from "../../utils/effects.utils.js";
import { addEffectHoverToZoomImage } from "../../utils/images.utils.js";
import domsComponent from "../dom.components.js";
import { createImgElement } from "./image.component.js";

export async function createImageFrame(image, link, scaleHover) {
      const wrapper = domsComponent.createDiv({cssClass: 'image-wrapper'});
      const imageSrc = `${appConfigs.SERVER}/${ServerFolders.IMAGES}/${image.image_url}`;
      
      const frame = createImgElement({
            src: imageSrc,
            cssClass: 'image-frame',
      });

      frame.setAttribute('data-lightbox-src', imageSrc);
      frame.setAttribute('link', link)
      frame.removeAttribute('data-spa');

      frame.width = image.width / 2;
      frame.height = image.height / 2;

      wrapper.appendChild(frame);
      
      console.log('hoverToScale: ', scaleHover);
      if(scaleHover) 
            addHoverToScaleEffect(wrapper);
      else 
            addEffectHoverToZoomImage(wrapper, frame);

      return wrapper;
}

