import { ServerFolders } from "../../../constants/folder.constant.js";
import VideoArticle from "./video-article.class.js";

export default class ClipVideoArticle extends VideoArticle {
      constructor(clip, options = {}) {
            super(clip, { 
                  folder: ServerFolders.CLIPS, 
                  linkPrefix: 'clip',
                  showVideoInfor: false,
                  hoverToScale: options.hoverToScale ?? true,
                  ...options
            });
      }

      async createVideoInfor() {
            return null;
      }
}