import VideoBase from "./video-base.class.js";
import VIDEO_TYPE_CONFIGS from "./video.config.js";

export default class AnimeVideoArticle extends VideoBase {
      constructor(video) {
            super(video, VIDEO_TYPE_CONFIGS.anime);
      }
}