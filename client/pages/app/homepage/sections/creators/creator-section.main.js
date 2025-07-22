import apiService from "../../../../../api/api.instance.js";
import apiEndpoint from "../../../../../api/endpoint.api.js";
import AvatarComponent, { AvatarTypes } from "../../../../../components/images/avatar.component.js";

export default async function() {
      const creatorsWrapper = document.querySelector('[data-role="list-creators"]');
      const creators = await apiService.get(apiEndpoint.creators.getAll);
      const avatarComponent = AvatarComponent();
      creators.forEach(creator => {
            const creatorAvatar = avatarComponent.create(creator._id, AvatarTypes.CREATOR);
            creatorsWrapper.appendChild(creatorAvatar); 
      });
}