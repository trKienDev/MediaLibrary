import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";

const animeFilmId = window.PageParams.id;

export default async function() {
      const animeFilm = await apiService.getById(apiEndpoint.anime_films.getById, animeFilmId);
      const videoIds = animeFilm.video_ids;

      if(Array.isArray(videoIds) && videoIds.length > 0) {
            const firstVideoId = videoIds[0];
            App.spa.router.go(`/anime-video/${firstVideoId}`);
            return;
      }
}