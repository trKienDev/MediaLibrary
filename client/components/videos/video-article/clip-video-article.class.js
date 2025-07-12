import { ServerFolders } from "../../../constants/folder.constant.js";
import VideoArticle from "./video-article.class.js";

export default class ClipVideoArticle extends VideoArticle {
      constructor(clip) {
            super(clip, { folder: ServerFolders.CLIPS, linkPrefix: 'clip-video' });
      }

      async createVideoInfor() {
            return null;
      }
}