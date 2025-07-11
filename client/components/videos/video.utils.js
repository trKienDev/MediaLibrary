import appConfigs from "../../config/app.config.js";
import domsComponent from "../dom.components.js";

function createVideoPlayer({ name, filepath, folder }) {
      const container = domsComponent.createDiv('video-container');
      const video = createVideoPreview('video-frame');
      const source = createVideoSource(`${appConfigs.SERVER}/${folder}/${filepath}`);
      video.appendChild(source);
      container.appendChild(video);
      return container;
}
function createVideoPreview(cssClass) {
      const video = document.createElement('video');
      video.classList.add(cssClass);
      video.controls = false;
      video.muted = true;
      return video;
}
function createVideoSource(src) {
      const source = document.createElement('source');
      source.src = src;
      source.type = 'video/mp4';
      return source;
}

const videoUtils = {
      createVideoPlayer,
      createVideoPreview,
      createVideoSource,
}
export default videoUtils;