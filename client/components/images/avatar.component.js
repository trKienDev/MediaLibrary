import apiService from "../../api/api.instance.js";
import apiEndpoint from "../../api/endpoint.api.js";
import appConfigs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folder.constant.js";
import { addHoverToScaleEffect } from "../../utils/effects.utils.js";
import domsComponent from "../dom.components.js";
import imageComponent from "./image.component.js";

async function createAvatar(data) {
      const creatorAvatarImg = await apiService.getImage(apiEndpoint.creators.getById, data._id);
      const avatarSrc = `${appConfigs.SERVER}/${ServerFolders.CREATOR_AVATARS}/${creatorAvatarImg}`;
      const creatorAvatar = await createAvatarFrame({
            creatorId: data._id , avatarSrc: avatarSrc, cssClass: 'avatar-image'
      });
      addHoverToScaleEffect(creatorAvatar)

      return creatorAvatar;
}
async function createAvatarFrame({ creatorId, avatarSrc, cssClass }) {
      const avatarFrame = domsComponent.createDiv('avatar-frame');
      const avatarFrameContainer = domsComponent.createDiv('avatar-frame-wrapper');
      const avatarImg = imageComponent.createImgElement({ src: avatarSrc, cssClass: cssClass });
      const creatorAhref = domsComponent.createAhref({ href: `creator/#id=${creatorId }`});
      
      creatorAhref.appendChild(avatarImg);
      avatarFrameContainer.appendChild(creatorAhref);
      avatarFrame.appendChild(avatarFrameContainer);
      
      return avatarFrame;
}

const avatarComponent = {
      createAvatar,
}
export default avatarComponent;