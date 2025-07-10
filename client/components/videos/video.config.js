import { ServerFolders } from "../../constants/folder.constant";

const VIDEO_TYPE_CONFIGS = {
      video: {
            hrefPrefix: 'video',
            folder: ServerFolders.VIDEOS,
            linkClass: 'video-article-link'
      },
      anime: {
            hrefPrefix: 'anime-video',
            folder: ServerFolders.ANIME_VIDEOS,
            linkClass: 'anime-video-article-link'
      }
};
export default VIDEO_TYPE_CONFIGS;
