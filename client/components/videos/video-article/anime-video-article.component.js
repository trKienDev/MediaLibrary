import { ServerFolders } from "../../../constants/folder.constant";
import VideoArticle from "./video-article.component.js";

export default class AnimeVideoArticle extends VideoArticle {
      constructor(video) {
            super( video, { folder: ServerFolders.ANIME_VIDEOS, linkPrefix: 'anime-video' });
      }
}