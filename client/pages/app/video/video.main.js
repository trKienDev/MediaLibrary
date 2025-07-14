import apiService from "../../../api/api.instance";
import apiEndpoint from "../../../api/endpoint.api";
import domsComponent from "../../../components/dom.components";
import tagComponent from "../../../components/tags/tags.component";
import VideoUtils from "../../../components/videos/video.utils";
import { ServerFolders } from "../../../constants/folder.constant";

const videoId = window.PageParams.id;

(async function() {
      // .............
})();

/* ------------------- Helper generic ------------------- */
async function renderListToElement({ element, items, renderItemFunc }) {
      if(!element) return;
      element.innerHTML = '';
      for(const item of items) {
            try {
                  // ...................
            } catch(error) {
                  throw new error;
            }
      }
}

/* ------------------- Render video section  ------------------- */
async function renderVideoData(video) {
      VideoUtils.updateVideoSourceById({
            elementId: 'video-player',
            iVideo: video,
            uploadPath: ServerFolders.VIDEOS
      });

      // ..................
}

async function populateVideoFilm(video) {
      const filmName = await apiService.getName(apiEndpoint.films.getById, video.film_id);
      domsComponent.updateSpanText('video-film-name', filmName);
}
async function populateVideoAction(video) {
      const actionWrapper = document.getElementById('video-action-wrapper');
      actionWrapper.innerHTML = '';

      const videoAction = await tagComponent.createTagDivWithApi({ tagId: video.action_id, cssClass: 'tag-element'});
      videoAction.classList.add('pink-btn');
      actionWrapper.appendChild(videoAction);
      
      return actionWrapper;
}

