import { ServerFolders } from "../../../constants/folder.constant.js";
import VideoArticle from "./video-article.class.js";

export default class AnimeVideoArticle extends VideoArticle {
      constructor(video) {
            super( video, { folder: ServerFolders.ANIME_VIDEOS, linkPrefix: 'anime-video' });
      }

      async createVideoInfor() {
            return null; // overide nhưng trả về null --> ko hiển thị ìnor
      }
}