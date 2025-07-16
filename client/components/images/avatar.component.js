import apiService from "../../api/api.instance.js";
import apiEndpoint from "../../api/endpoint.api.js";
import appConfigs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folder.constant.js";
import { addHoverToScaleEffect } from "../../utils/effects.utils.js";
import domsComponent from "../dom.components.js";

export const AvatarTypes = {
      IDOL: 'idol',
      CREATOR: 'creator',
}
// Component-based design theo kiểu factory pattern
function AvatarComponent() {
      const create = async (id, type) => {
            let path = null;
            let imgSrc = null;
            switch(type) {
                  case AvatarTypes.IDOL: 
                        path = await apiService.getAvatarUrl(apiEndpoint.idols.getById, id);
                        imgSrc = `${appConfigs.SERVER}/${ServerFolders.IDOLS}/${path}`;
                        break;
                  case AvatarTypes.CREATOR: 
                        path = await apiService.getImage(apiEndpoint.creators.getById, id);
                        imgSrc = `${appConfigs.SERVER}/${ServerFolders.CREATOR_AVATARS}/${path}`;
                        break;
                  default:
                        return 'default.png';
            }
            return render(id, imgSrc, type);
      }
      const render = ( id, imgSrc, type) => {
            const frame = domsComponent.createDiv({ cssClass: 'avatar-frame'});
            const wrapper = domsComponent.createDiv({cssClass: 'avatar-frame-wrapper'});
            const img = createImgElement({ src: imgSrc, cssClass: 'avatar-image' });
            const link = domsComponent.createAhref({ 
                  href: `${type}/${id }`,
                  attrs: {
                        'data-spa': 'true'
                  }
            });

            link.appendChild(img);
            wrapper.appendChild(link);
            frame.appendChild(wrapper);
            addHoverToScaleEffect(frame);

            return frame;
      }

      return { create };
}

export default AvatarComponent;