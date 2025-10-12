import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import domsComponent from "../../../components/dom.components.js";
import AvatarComponent, { AvatarTypes } from "../../../components/images/avatar.component.js";
import ClipVideoArticle from "../../../components/videos/video-article/clip-video-article.class.js";
import appConfigs from "../../../config/app.config.js";
import { ServerFolders } from "../../../constants/folder.constant.js";

const clipId = window.PageParams.id;

export default async function () {
      const clip = await apiService.getById(apiEndpoint.clips.getById, clipId);
      const record = await apiService.getById(apiEndpoint.records.getById, clip.record_id);
      console.log('record: ', record);
      const idol = await apiService.getById(apiEndpoint.idols.getById, clip.idol_id);

      if(idol) {
            renderIdolData(idol);
      }

      populateVideoPlayer(clip);
      renderRelatedClips(record);
      populateRecordInfor(record);
}

async function renderIdolData(idol) {
      const idolAvatarEl = document.querySelector('[data-role="idol-avatar"]');
      const avatarComponent = AvatarComponent({ enableHoverEffect: false });
      const idolAvatar = await avatarComponent.create(idol._id, AvatarTypes.IDOL);
      idolAvatarEl.appendChild(idolAvatar);

      const idolNameEl = document.querySelector('[data-role="idol-name"]');
      const idolNameValue = domsComponent.createSpan({
            text: idol.name,
            cssClass: 'idol-name'
      });
      idolNameEl.appendChild(idolNameValue);

      const idolIdentifier = document.querySelector('[data-role="idol-identifier"]');
      const idolIdentifierValue = domsComponent.createSpan({
            text: idol.identifier_name,
            cssClass: 'idol-identifier'
      });
      idolIdentifier.appendChild(idolIdentifierValue);

      const idolCountry = document.querySelector('[data-role="idol-country"]');
      const idolCountryValue = domsComponent.createSpan({
            text: idol.region,
            cssClass: 'idol-country'
      });
      idolCountry.appendChild(idolCountryValue);
}
function populateVideoPlayer(clip) {
      const videoUrl = `${appConfigs.SERVER}/${ServerFolders.CLIPS}/${clip.file_path}`;
      const videoElement = document.querySelector('[data-role="video-player"]');
      const videoSource = videoElement.querySelector('source');
      videoSource.src = videoUrl;
      videoElement.load();
}
async function renderRelatedClips(record) {
      const relatedClips = document.querySelector('[data-role="related-videos"]');

      const clipIds = record.clip_ids.filter(x => x !== clipId);
      const clips = await Promise.all(
            clipIds.map(id => apiService.getById(apiEndpoint.clips.getById, id))
      );

      clips.forEach(async (clip) => {
            const videoComponent = new ClipVideoArticle(clip);
            const videoPlayer = await videoComponent.render();
            relatedClips.appendChild(videoPlayer);
      });
}

function populateRecordInfor(record) {
      const recordNameEl = document.querySelector('[data-role="record-name"]');
      recordNameEl.textContent = record.name;
}