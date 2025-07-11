import appConfigs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folder.constant";
import imageUtils from "../../utils/images.utils.js";
import domsComponent from "../dom.components.js";
import imageComponent from "./image.component";

async function createImageFrame(image) {
      const imageWrapper = domsComponent.createDiv('image-wrapper');
      const imageSrc = `${appConfigs.SERVER}/${ServerFolders.IMAGES}/${image.image_url}`;
      
      const imageElement = imageComponent.createImgElement({
            src: imageSrc,
            cssClass: 'image-element'
      });
      imageElement.width = image.width / 2;
      imageElement.height = image.height / 2;

      imageWrapper.appendChild(imageElement);
      imageUtils.addEffectHoverToZoomImage(imageWrapper, imageElement);

      return imageWrapper;
}

const imageFrameComponent = {
      createImageFrame,
}
export default imageFrameComponent;