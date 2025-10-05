import apiService from "../../../../../api/api.instance.js";
import apiEndpoint from "../../../../../api/endpoint.api.js";
import domsComponent from "../../../../../components/dom.components.js";
import AvatarComponent, { AvatarTypes } from "../../../../../components/images/avatar.component.js";

export default async function() {         
      const creatorsWrapper = document.querySelector('[data-role="list-creators"]');
      const creators = await apiService.get(apiEndpoint.creators.getAll);
      
      const avatarComponent = AvatarComponent({ hoverZoomEffect: true });
      creators.forEach(async (creator) => {
            const creatorAvatarDiv = domsComponent.createDiv({ cssClass: 'creator-avatar-frame' });
            const creatorAvatarImage = await avatarComponent.create(creator._id, AvatarTypes.CREATOR);
            creatorAvatarDiv.appendChild(creatorAvatarImage);

            const creatorNameDom = domsComponent.createSpan({ 
                  text: creator.name,
                  cssClass: 'creator-name'
            })
            creatorAvatarDiv.appendChild(creatorNameDom);

            creatorsWrapper.appendChild(creatorAvatarDiv);
      })
}