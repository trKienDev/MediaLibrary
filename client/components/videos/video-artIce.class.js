import VideoBase from "./video-base.class.js";
import VIDEO_TYPE_CONFIGS from "./video.config.js";

export default class VideoArticle extends VideoBase {
      constructor(video) {
            super(video, VIDEO_TYPE_CONFIGS.video);
      }
}