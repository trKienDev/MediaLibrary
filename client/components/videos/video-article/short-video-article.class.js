import { ServerFolders } from "../../../constants/folder.constant.js";
import VideoArticle from "./video-article.class.js";

export default class ShortVideoArticle extends VideoArticle {
      constructor(short) {
            super(short, { folder: ServerFolders.SHORTS, linkPrefix: 'short-video', cssClass: 'short-article'});
      }

      async createVideoInfor() {
            return null;
      }
}