import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";

const filmId = window.PageParams.id;

export default async function() {
      const film = await apiService.getById(apiEndpoint.films.getById, filmId);
      const videoIds = film?.video_ids ?? film?.videoIds ?? [];
      
      if (Array.isArray(videoIds) && videoIds.length > 0) {
            const firstVideoId = videoIds[0];

            App.spa.router.go(`/video/${firstVideoId}`);
            return;
      }
}