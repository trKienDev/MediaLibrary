import apiService from "../../api/api.instance.js";
import apiEndpoint from "../../api/endpoint.api.js";
import domsComponent from "../dom.components.js";
import avatarComponent from "../images/avatar.component.js";
import AnimeVideoArticle from "./anime-video-article.class.js";
import VideoArticle from "./video-artice.class.js";
import videoBehavior from "./video.behavior.js";
import videoService from "./video.service.js";
import videoUtils from "./video.utils.js";

function createInfor({ ihref, itext, icssClass, icontainerCss }) {
      const link = domsComponent.createAhref({
            href: ihref,
            text: itext,
            cssClass: icssClass
      });
      const container = domsComponent.createDiv(icontainerCss);
      container.appendChild(link);
      return container;
}
async function createVideoInfor(video) {
      const creatorData = await apiService.getById(apiEndpoint.creators.getById ,video.creator_id);
      const videoInfoDiv = domsComponent.createDiv('video-info');
      const container = domsComponent.createDiv('video-info-container');
      const avatar = await avatarComponent.createAvatar(creatorData);
      container.appendChild(avatar);
      const [filmName, creatorName] = await videoService.getFilmAndCreatorNames(video);

      const filmInfor = createInfor({
            ihref: video.film_id,
            itext: filmName,
            icssClass: 'video-film',
            icontainerCss: 'video-film-container',
      });
      const creatorInfor = createInfor({
            ihref: video.creator_id,
            itext: creatorName,
            icssClass: 'video-creator',
            icontainerCss: 'video-creator-container',
      });

      const details = domsComponent.createDiv('video-details');
      const videoViews = domsComponent.createSpan({
            text: `${video.views} views`,
            cssClass: 'video-views'
      });
      
      details.append(filmInfor, creatorInfor, videoViews);
      container.appendChild(details);
      videoInfoDiv.appendChild(container);

      return videoInfoDiv;
}

const videoComponent = {
      createVideoArticle: async (video) => await new VideoArticle(video).createArticle(),
      createAnimeVideoArticle: async(video) => await new AnimeVideoArticle(video).createArticle(),
      createVideoPlayer: videoUtils.createVideoPlayer,
      createVideoSource: videoUtils.createVideoSource,
      attachHoverPlayHandler: videoBehavior.attachHoverPlayHandler,
      createVideoInfor,
}
export default videoComponent;