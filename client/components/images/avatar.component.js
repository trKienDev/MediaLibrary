import apiService from "../../api/api.instance.js";
import appConfigs from "../../config/app.config";
import { ServerFolders } from "../../constants/folder.constant.js";
import imageUtils from "../../utils/images.utils.js";
import domsComponent from "../dom.components.js";
import imageComponent from "./image.component.js";

async function createAvatar(creatorId) {
      const creatorAvatarImg = await apiService.getImage(creatorId);
      const avatarSrc = `${appConfigs.SERVER}/${ServerFolders.CREATOR_AVATARS}/${creatorAvatarImg}`;
      const creatorAvatar = createAvatarFrame({
            creatorId, avatarSrc, cssClass: 'avatar-image'
      });

      return creatorAvatar;
}
async function createAvatarFrame({ creatorId, avatarSrc, cssClass }) {
      const avatarFrame = domsComponent.createDiv('avatar-frame');
      const avatarFrameContainer = domsComponent.createDiv('avatar-frame-container');
      const avatarImg = imageComponent.createImgElement({ src: avatarSrc, cssClass: cssClass });
      const creatorAhref = domsComponent.createAhref({ href: `creator/#id=${creatorId }`});
      
      creatorAhref.appendChild(avatarFrame);
      avatarFrameContainer.appendChild(creatorAhref);
      imageUtils.addEffectHoverToZoomImage(avatarFrameContainer, avatarImg);
      avatarFrame.appendChild(avatarFrameContainer);
      
      return avatarFrame;
}

const avatarComponent = {
      createAvatar,
}
export default avatarComponent;