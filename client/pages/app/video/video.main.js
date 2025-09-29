import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import appConfigs from "../../../config/app.config.js";
import { ServerFolders } from "../../../constants/folder.constant.js";

const videoId = window.PageParams.id;

export default async function() {
      console.log('video id: ', videoId);
      const videoInfor = await apiService.getById(apiEndpoint.videos.getById, videoId);
      console.log('video infor: ', videoInfor);
      const filmInfor = await apiService.getById(apiEndpoint.films.getById, videoInfor.film_id);
      console.log('film infor: ', filmInfor);

      renderFilmThumbnail(filmInfor);

      populatetVideoPlayer(videoInfor);

}

function renderFilmThumbnail(film) {
      const filmThumbnailElement = document.getElementById('video-film-thumbnail');
      filmThumbnailElement.src = `${appConfigs.SERVER}/${ServerFolders.FILMS}/${film.thumbnail}`;
}

function populatetVideoPlayer(video) {
      const videoUrl = `${appConfigs.SERVER}/${ServerFolders.VIDEOS}/${video.file_path}`;
      const videoElement = document.getElementById('video-player');

      const videoSource = videoElement.querySelector('source');
      videoSource.src = videoUrl;
      videoElement.load();
}

